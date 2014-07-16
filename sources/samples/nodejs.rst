:title:  Node.js samples
:description:   A brief description about Node.js_sample 
:keywords: Node.js, Language, version numbers, script, Notification alerts


.. _Nodejs :

node.js-samples
===============

These samples will help you get started with Shippable. Test and Coverage tools used here are
`istanbul  <https://npmjs.org/package/istanbul>`_  and `mocha  <https://npmjs.org/package/mocha>`_ .

`Node Sample <https://github.com/Shippable/sample_node>`_

`Node Sample with CouchDB <https://github.com/Shippable/sample-node-couchdb>`_

`Node Sample with MongoDB <https://github.com/Shippable/sample_node_mongo>`_

`Node Sample with MySQL <https://github.com/Shippable/sample_node_mysql>`_

`Node Sample with Neo4j <https://github.com/Shippable/sample_node_neo4j>`_

`Node Sample with Postgres <https://github.com/Shippable/sample_node_postgres>`_

`Node Sample with Protractor <https://github.com/Shippable/sample_node_protractor>`_

`Node Sample with RethinkDB <https://github.com/Shippable/sample-node-rethinkdb>`_

`Node Sample with Selenium <https://github.com/Shippable/sample_node_selenium>`_

`Node Sample with SQLite <https://github.com/Shippable/sample_node_sqlite>`_

Keep the test and code coverage output in the special folders Shippable/testresults and Shippable/codecoverage to get your reports parsed.

We need the yml file to analyze the project details. So add the shippable.yml file to the root of your repo by specifying:

**language :** Specify the language used to create the project. node_js is used in our project.

**version numbers :** 0.10 is used.

**env:** Specify the xunit output file path using env.

**script:** Specify the command to run tests using script key.

**after_script:** Specify the command to generate code coverage and save the results in their respective shippable folder. If you have not created the folders, you can create them using the before_script key.

Here is the complete yml file for sample_node project.

.. code-block:: bash

	# Language setting
      	language: node_js

	# Version number
      	node_js:
          - 0.10.25

	# The path for Xunit to output test reports
   	env:
     	  - XUNIT_FILE=shippable/testresults/result.xml

	# Create directories for test and coverage reports
   	before_script:
     	  - mkdir -p shippable/testresults
          - mkdir -p shippable/codecoverage

	# Running the tests with grunt
   	script:
     	  - grunt

	# Tell istanbul to generate a coverage report
   	after_script:
     	  - ./node_modules/.bin/istanbul cover grunt -- -u tdd
          - ./node_modules/.bin/istanbul report cobertura --dir  shippable/codecoverage/

Enable the repo sample_node and run it using an Ubuntu minion. Once the build finishes execution, you can check for the console output, test and codecoverage results on the respective build's page.
