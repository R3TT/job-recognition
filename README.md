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
// returns 3 titles
// County Executive, CEO, guide

titlesFound = jr.find( txt, { capitalized : true } );
// returns 2 titles
// County Executive, CEO
```

## Release History

* 2018.06.19 - version 1.0.1
  * original version
* 2018.06.20 - version 1.0.2
  * npm version