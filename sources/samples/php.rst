:titles: PHP-buildsample
:description: A brief description about php buildsample
:keywords: php, Language,phpunit,script,Notification alerts


.. _php:

PHP-buildsample 
===================

These samples will help you get started with Shippable. Test and Coverage tools used here are
`phpunit <http://phpunit.de/>`_.

`PHP Sample <https://github.com/Shippable/sample_php>`_

`PHP Sample with MySQL <https://github.com/Shippable/sample_php_mysql>`_

`PHP Sample with MongoDB <https://github.com/Shippable/sample_php_mongo>`_

We need the yml file to analyze the project details. So add the shippable.yml file to the root of your repo by specifying:

**language :** Specify the language used to create the project. php is used in this sample project.

**php :** Specify the runtime against which your build needs to run using **php** tag. The sample project uses “5.4".

**script :** Specify the command to run the test using script key and export the generated junit test output to shippable/testresults folder to get the visualization of test reports. 


**notification alerts:** Email notifications are disabled in this sample project.

This is the complete yml file for php-buildsample:

.. code-block:: bash

	language: php

	php: 
  	  - 5.4

        before_script: 
          - mkdir -p shippable/testresults

        script:
          - phpunit  --log-junit shippable/testresults/junit.xml tests/calculator_test.php
          
        notifications:
          email: false


Create a project by enabling the repo php-buildsample and run it using an Ubuntu minion. Once the build finishes execution, you can check for the console output and test results on the respective build’s tab.

