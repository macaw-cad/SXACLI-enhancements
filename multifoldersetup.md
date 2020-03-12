

grid -> algemeen, kan geassigned worden aan site
theme -> algemeen, kan geassigned worden aan een site

rendering variants --> per site
- shared
  - -\scriban\
    - Page Content\Blog Post\item.scriban   
- site1
 - -\scriban\
    - Page Content\Blog Post\item.scriban   

gulptasks
    index.js
defaulttheme
themes
  mytheme
    sources
      grid.scss -> set vars, include from bootstrap sass node_modules

grids
  bootstrap4

renderingvariants
    shared
        gulp
          config.js
          jsdoc.json
          serverConfig.json
        -/scriban
        index.js (minimal gulp)