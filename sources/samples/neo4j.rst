:title: neo4j-buildsample
:description: A brief description about neo4j-buildsample
:keywords: neo4j, Language,version number, Install, Notification alerts

.. _python :

neo4j-buildsample
==================== 

The goal of this code sample is to show you how to set up and run your repo in shippable.

A sample repository `Python-buildsample <https://github.com/Shippable/Python-buildsample>`_ has been created using `nose <https://pypi.python.org/pypi/nose>`_ and `coverage 3.7  <https://pypi.python.org/pypi/coverage/>`_  .


Keep the output generated for test and code coverage in the special folder Shippable/testresults and Shippable/codecoverage to get parsed reports parsed and to get a visualization of the reports.The test results must be generated in Junit format.

We need the yml file to analyze the project details. Add the shippable.yml file to the root of your repo by specifying:


**language :** Specify the language used to create the project. Python is used in this sample project.

**version number :** Specify the version numbers against which your build needs to run. The sample project uses "2.7".

**install :** Install the required dependencies for your repo here.

**script :** Specify the command to run the test and coverage and save the results to their respective 
shippable folders. If you have not created the folders, then you can create it using the before_script key.

**Notification alerts:**  Email notifications are added to get the alerts about the build status.

Here is the complete yml file for Python-buildsample

.. code-block:: bash
   
   language: ruby

rvm:
  - jruby-1.7.9

services:
  - neo4j
  
install:
  - gem install neo4j

script:
  - ruby sample.rb
 
    python:
  	- "2.7"
    language: python
    before_script: mkdir -p shippable/codecoverage shippable/testresults
    install: pip install --use-mirrors -r requirements.txt
    script: 
      - nosetests python/sample.py --with-xunit --xunit-file=shippable/testresults/nosetests.xml
      - coverage run --branch python/sample.py
      - coverage xml -o shippable/codecoverage/coverage.xml python/sample.py
    notifications:
      email:
       - exampleone@org.com

Enable the repo Python-buildsample and run it using an Ubuntu minion. Once the build finishes execution, you can check for the console output, test and codecoverage results on the respective build's page.

