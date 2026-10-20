# Table of Contents
- **[Local development](#local-development)**
- **[Updating your profile](#updating-your-profile)**: `_data/members.yml`
- **[Adding a publication](#adding-a-publication)**: `_publications/paper_name.yml`
- **[Updating the travel map](#updating-the-travel-map)**: `_data/*_travel.yml`

# Local Development
1. Follow the instructions [here](https://jekyllrb.com/docs/installation/) to install `ruby`, `jekyll`, and `bundler`
2. Clone down your fork `git clone git@github.com:chai-toronto/chai-toronto.github.io.git`
3. Enable the repo's git hooks (once per clone): `git config core.hooksPath .githooks`. This keeps the travel map's coordinates up to date when you commit; see [Updating the Travel Map](#updating-the-travel-map).
4. Serve the site and watch for markup/sass changes `bundle exec jekyll serve`
5. View your website at http://127.0.0.1:4000/
6. Commit any changes and push everything to the master branch of your GitHub user repository. GitHub Pages will then rebuild and serve your website.

# Updating Your Profile
## Edit Metadata
Add an entry to `_data/members.yml` with the following fields:
| Field | Required | Details |
| --- | --- | --- |
| `id` | yes | Should usually be formatted as `lastname_firstname`. This is what you'll use throughout the site to refer to yourself and link to your homepage. |
| `name` | yes | Full name |
| `affiliation` | yes | Departmental program |
| `image` | yes | Path to your profile picture. Images should be square and ideally 165x165px. |
| `website` | yes | Full link to your personal website |
| `degree` | yes | The shorthand name of your degree, such as `PhD`, `MSc`, or `BS` |
| `active` | yes | Put `true` if you are currently working in the lab or `false` if you are now working elsewhere |

## Upload an Image
Images should be uploaded to `images/members/`. Images should be square and (ideally) 165x165px. If you upload something else, it will be cropped.

# Adding a Publication
Create a new file in `_publications/`. The file should have the following fields:
| Field | Required | Details |
| --- | --- | --- |
| `title` | yes | Verbatim paper title |
| `authors` | yes | This should be a list of full names. If an author is a lab member (or former lab member), use the member's `id` instead of their name to link it to their website. |
| `venue` | yes | Full name of the publication venue. If it is a common name, look in `_data/venues.yml` to see if a shortcut has been defined. If so, you can use the shorthand name (including the `$` delimiters) and the full name will automatically be used. You can mix shorthand names with other text if you need to specify that it was submitted to a workshop or alternative track. |
| `date` | yes | Publication/presentation date |
| `thumbnail` | yes | Must be 16x9 and 300px wide. Add to `images/pubs/`. |
| `award` | no | The name of the award the paper received (e.g., `'Best Paper Award'` or `'Honorable Mention Award'`) |
| `abstract` | no | Copy from the ACM DL or equivalent when possible, otherwise use Google Scholar. |
| `news` | no | List of different press releases, which contains <ul><li>`name`: the name of the news entity</li><li>`url`: the url to the article</li><li>`headline`: the headline</li><li>`date`: the date the article was published</li></ul> |
| `video_embed` | no | HTML embed code for video player |

# Updating the Travel Map
Add an entry to the matching file in `_data/` (`personal_travel.yml`, `conference_travel.yml`, `talks_travel.yml`, `internship_travel.yml`, or `life_travel.yml`):
| Field | Required | Details |
| --- | --- | --- |
| `city` | yes | `City, ST` for US cities, `City, PROVINCE` (e.g., `ON`, `BC`) or `City, Canada` for Canadian cities, and `City, Country` everywhere else. The part after the last comma is used to count countries. |
| `year` | yes | Year of the trip; used by the timeline slider |
| `reason` | no | Shown in the pin's popup (e.g., `CHI 2025`) |
| `lat`, `lng` | no | Set these to place the pin yourself instead of looking it up |

When you commit a change to a travel file, the pre-commit hook (`.githooks/pre-commit`) looks up coordinates for any new cities and adds `_data/travel_coordinates.json` to the same commit. It prints what each city matched to, so check that for wrong matches. If a city can't be found, the commit stops; fix the name or add `lat`/`lng`. To correct a pin, edit its entry in `_data/travel_coordinates.json` directly.

If the hook isn't enabled (e.g., on a new clone), run `git config core.hooksPath .githooks` once, or update the coordinates by hand with `ruby _scripts/update_travel_coordinates.rb`.
