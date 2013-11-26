.. module:: mapstore.installing.managerconfig
   :synopsis: Learn about MapManager configuration.

.. _mapstore.installing.managerconfig:

MapManager Configuration
------------------------

The MapManager configuration is a JavaScript Object with the essential properties to set:

	- Requests base URL and proxy to GeoStore 
	- Basic requests URL parameters to manage paging and requests timeout.
	- Locale settigs
	- Social links settings for save Maps.

Configuration Options
^^^^^^^^^^^^^^^^^^^^^

*   `baseUrl:`: Geostore URL (**if empty http://<server>:<port>/geostore/rest/ is used**).

*   `proxyUrl`: Define the proxy URL to use for GeoStore requests.

*   `start`: Specify the first visualized page inside the Maps List. By default to **0**.

*   `limit`: Specify the number of Maps per Page inide the Maps List. By default to **20**.

*   `msmTimeout`: This is the nember of *milliseconds* used to set the Ajax requests timeout. By default to **30000** (30 s).

*   `twitter`: Configuration Object to set *Twitter* share button properties (`via` and `hashtags` by default).

*   `locales`: Defines the set of languages that must be used for the MapManager (the first of the array is the default one). Currenlty on **it, en, de and fr** languages are supported in MapStore (more information about it in :ref:`mapstore.translations` section).

Below the default configuration user in MapStore for the MapManager::

		var config = {
			baseUrl: '',
			
			proxyUrl: '/http_proxy/proxy/',

			start: 0,

			limit: 20,
			
			msmTimeout: 30000,
			
			twitter: {
				via: 'geosolutions_it',
				hashtags: ''
			},
			
			locales: [['en', 'English'],['it','Italiano'],['fr','Franch'],['de','Deutsch']]
		};