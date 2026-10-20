# Keeps _data/travel_coordinates.json in sync with the _data/*_travel.yml files.
#
# - Looks up coordinates (via Mapbox) for any city not already in the JSON
# - Skips entries that set their own lat/lng in the YAML
# - Removes cities that no longer appear in any travel file
# - Leaves existing entries untouched, so hand-corrected coordinates stick
#
# Usage: ruby _scripts/update_travel_coordinates.rb

require 'json'
require 'yaml'
require 'net/http'
require 'uri'

ROOT = File.expand_path('..', __dir__)
COORDS_PATH = File.join(ROOT, '_data', 'travel_coordinates.json')

token = ENV['MAPBOX_TOKEN'] || YAML.load_file(File.join(ROOT, '_config.yml'))['mapbox_token']
abort 'No Mapbox token found (set MAPBOX_TOKEN or mapbox_token in _config.yml)' unless token

cities = Dir[File.join(ROOT, '_data', '*_travel.yml')].sort.flat_map do |path|
  (YAML.load_file(path) || []).filter_map do |trip|
    next if trip['lat'] && trip['lng']
    trip['city'].to_s.strip.then { |c| c unless c.empty? }
  end
end.uniq

coords = File.exist?(COORDS_PATH) ? JSON.parse(File.read(COORDS_PATH)) : {}

removed = coords.keys - cities
removed.each { |city| coords.delete(city) }

added = []
failed = []
(cities - coords.keys).each do |city|
  uri = URI("https://api.mapbox.com/geocoding/v5/mapbox.places/#{URI.encode_www_form_component(city)}.json")
  uri.query = URI.encode_www_form(access_token: token, limit: 1)
  response = Net::HTTP.get_response(uri)
  center = response.is_a?(Net::HTTPSuccess) && JSON.parse(response.body).dig('features', 0, 'center')
  if center
    coords[city] = center.map { |n| n.round(6) }
    added << "#{city} -> #{coords[city].reverse.join(', ')} (#{JSON.parse(response.body).dig('features', 0, 'place_name')})"
  else
    failed << city
  end
end

File.write(COORDS_PATH, JSON.pretty_generate(coords.sort.to_h) + "\n")

puts "Added #{added.size}:", added.map { |l| "  + #{l}" } unless added.empty?
puts "Removed #{removed.size}:", removed.map { |c| "  - #{c}" } unless removed.empty?
puts 'No changes.' if added.empty? && removed.empty?
unless failed.empty?
  warn "Could not find coordinates for: #{failed.join('; ')}"
  exit 1
end
