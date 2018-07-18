# job-recognition
job-recognition is a library for finding all job titles in an arbitrary piece of text. The library is currently very USA-centric since the initial set of names came from O*Net data (https://www.onetcenter.org/database.html).

by Rett Crocker

## Installation

`npm install job-recognition`

## Usage

```
var jr = require( 'job-recognition' );
var txt = 'The county municipal building on Monroe Avenue is named for former County Executive Edwin Michaels and county-owned Allen park in Somers is named to memorialize former CEO Alfred DelCampo of Washburn Chemicals. Edwin Michaels is currently retired and living in South Palmetto County where he is a nature guide at the local state park.';
var namesFound;
titlesFound = jr.find( txt );
// returns 4 titles
// - county municipal building on
// - County Executive
// - CEO
// - guide at the local state park

titlesFound = jr.find( txt, { capitalized : true } );
// returns 2 titles
// - County Executive
// - CEO
```

## Release History

* 2018.07.18 - version 1.1.5
  * Fixed bug with non-single titles
* 2018.07.17 - version 1.1.4
  * added search for single as primary (didn't find "Principal" before this change)
* 2018.07.02 - version 1.1.3
  * removed some old code and stripping stops off both start and end
* 2018.06.29 - version 1.1.1
  * new revision using much part of speech approach
* 2018.06.20 - version 1.0.2
  * npm version
* 2018.06.19 - version 1.0.1
  * original version