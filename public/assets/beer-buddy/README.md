# Original Beer Buddy web assets

Extracted from the two user-provided transparent character sheets, without regenerating, recoloring, or redrawing artwork:

- Sunglass Beer Mugs_ Music, Work, Play.png: music, laptop, frisbee (left to right).
- Beer Buddy Adventure Sticker Trio.png: reading, hiking, peeking (left to right).

Each pose was isolated from its sheet, scaled to a maximum intermediate width of 320px with high-quality bicubic resampling, and trimmed to remove surrounding transparent padding. A small margin preserves antialiased outlines and accessories. Original uploaded sheets are untouched. All six outputs retain alpha transparency; no black matte is added.

Final dimensions: music 257×275, laptop 269×257, frisbee 298×227, reading 259×265, hiking 273×273, peeking 260×199. These are larger than their displayed sizes, including typical high-density displays. Combined PNG size is approximately 543 KB; images load lazily.

The reusable implementation is src/components/BeerBuddy.tsx and BeerBuddy.css. It supports a pose variant and positioning class. Pose metadata includes dimensions, accessible names, and messages. Placements are local to page sections, not fixed to the viewport. The hiking pose lives in the About Me travel section because this site does not have a Life route; this placement was selected by the user.
