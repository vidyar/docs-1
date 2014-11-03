:title: Neo4j samples
:description: A brief description about neo4j-sample
:keywords: neo4j, Language,version number, Install, services

.. _neo4j:

neo4j-samples
=============

These samples will help you get started with Shippable.

`Ruby Sample with Neo4j <https://github.com/shippableSamples/sample_ruby_neo4j>`_

`Node Sample with Neo4j <https://github.com/shippableSamples/sample_node_neo4j>`_

`Python Sample with Neo4j <https://github.com/shippableSamples/sample_python_neo4j>`_

We need the yml file to analyze the project details. Add the shippable.yml file to the root of your repo by specifying:


**language :** Specify the language used to create the project. Ruby is used in this sample project.

**version number :** Specify the version numbers against which your build needs to run. The sample project uses "jruby-1.7.9".

**services :** Specify the service required for this sample code using "services" tag.

**install :** Install the required dependencies for your repo here.

**script :** Execute the sample code using script tag. 

Here is the complete yml file for sample_ruby_neo4j project

.. code-block:: bash
   
   language: ruby

   rvm:
     - jruby-1.7.12

   services:
     - neo4j
  
   install:
     - gem install neo4j

   script:
     - ruby sample.rb
 
  
Enable the repo sample_ruby_neo4j and run it using an Ubuntu minion. Once the build finishes execution, you can check for the console output on the respective build's page.

