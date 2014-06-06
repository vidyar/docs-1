:title: Ruby Sample
:description: Step by step instructions to configure a ruby build in Shippable
:keywords: Ruby, Language, version number,env, Notification alerts

.. _ruby:

Ruby-buildsample
==================

These samples will help you get started with Shippable. Test and Coverage tools used here are
`simplecov <http://rubydoc.info/gems/simplecov/>`_  and `RSpec <http://rspec.info/>`_  .

`Ruby Sample <https://github.com/Shippable/sample_ruby>`_

We need the yml file to analyze the project details. So add the shippable.yml file to the root of your repo by specifying the following details:

**language :** Specify the language used to create the project. Ruby is used in this sample code.


**version number :** Specify the platform version using **rvm:**. This sample project uses 1.9.2

**env:** Keep the test and code coverage output in the special folders Shippable/testresults and Shippable/codecoverage to get parsed reports.

**notification alerts:** Email notifications are added to get alerts about the build status.

Here is the complete yml file for the Ruby-buildsample:

.. code-block:: bash
	
    language: ruby
    rvm:
      - 1.9.2
    env:
      - CI_REPORTS=shippable/testresults COVERAGE_REPORTS=shippable/codecoverage
    notifications:
      email:
        - exampleone@org.com
    # ensure the test output and coverage dirs are created
    before_script:
      - mkdir -p shippable/testresults   
    # write the rspec tests to the output dir
    script:
      - rspec -f JUnit -o shippable/testresults/results.xml  




Enable the repo Ruby-buildsample and run it using an Ubuntu minion. Once the build finishes execution, you can check for the console output, test and codecoverage results on the respective build's page.
