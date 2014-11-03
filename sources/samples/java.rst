:titles: Java samples
:description: A brief description about java_sample
:keywords: Java, Language,jdk,script,Notification alerts


.. _java :

java-samples
============

The goal of this code samples is to show you how to set up and build your repo on shippable. These projects use
`cobertura <http://cobertura.github.io/cobertura/>`_ and `Junit <http://junit.org/>`_ .

`Java Sample <https://github.com/shippableSamples/sample_java>`_

`Java Sample with MySQL <https://github.com/shippableSamples/sample_java_mysql>`_

`Java Sample with Postgres <https://github.com/shippableSamples/sample_java_postgres>`_

`Java Sample with MongoDB <https://github.com/shippableSamples/sample_java_mongo>`_

Keep the test and code coverage output in the special folders Shippable/testresults and Shippable/codecoverage to get parsed reports. Test results must be in Junit format.

We need the yml file to analyze the project details. So add the shippable.yml file to the root of your repo by specifying:

**language :** Specify the language used to create the project. Java is used in this sample project.


**jdk :** Specify the jdk against which your build needs to run. The sample uses oraclejdk7, openjdk6 and openjdk7.


**script :** Specify the command to run the test and code coverage using the script key. Specify the path of the output files (shippable/testresults and shippable/codecoverage) in the "build.properties" file for this project.


**notification alerts:** Email notifications are added to get alerts about the build status.

This is the complete yml file for sample_java project:

.. code-block:: bash

	language: java

	jdk:
   	   - openjdk7
   	   - oraclejdk7
           - openjdk6
           - oraclejdk8

        after_success:
           - mvn clean cobertura:cobertura
           - mvn test
      
        notifications:
          email:
              recipients:
         	 - exampleone@org.com
         	 - exampletwo@org.com

 

Create a project by enabling the repo sample_java and run it using an Ubuntu minion. Once the build finishes execution, you can check for the console output, test and codecoverage results on the respective build's page.
