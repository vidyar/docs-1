:titles: Java samples
:description: A brief description about java_sample
:keywords: Java, Language,jdk,script,Notification alerts


.. _java :

java-samples
============

The goal of this code samples is to show you how to set up and build your repo on shippable. These projects use
`cobertura <http://cobertura.github.io/cobertura/>`_ and `Junit <http://junit.org/>`_ .

`Java Sample <https://github.com/shippableSamples/sample_java>`_

`Java Sample with multi-module Maven build <https://github.com/shippableSamples/sample-java-maven-reactor>`_

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

**Multi-module Maven builds**
-----------------------------

When using multi-module (Reactor) builds, please remember to output all the coverage and tests reports to the (top-level)
repository directory. This can be tricky, as the Cobertura plugin resolves output directory differently from Surefire plugin.
The most straightforward way of dealing with this issue is to define plugin configuration in the top-level module, using
``shippable/codecoverage`` path for Cobertura plugin and ``../shippable/testresults`` for Surefire plugin:

.. code-block:: xml

  <plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>cobertura-maven-plugin</artifactId>
    <version>2.6</version>
    <configuration>
      <format>xml</format>
      <maxmem>256m</maxmem>
      <aggregate>true</aggregate>
      <outputDirectory>shippable/codecoverage</outputDirectory>
    </configuration>
  </plugin>
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>2.17</version>
    <configuration>
      <redirectTestOutputToFile>true</redirectTestOutputToFile>
      <reportsDirectory>../shippable/testresults</reportsDirectory>
    </configuration>
    <dependencies>
      <dependency>
        <groupId>org.apache.maven.surefire</groupId>
        <artifactId>surefire-junit4</artifactId>
        <version>2.7.2</version>
      </dependency>
    </dependencies>
  </plugin>

See `the following sample <https://github.com/shippableSamples/sample-java-maven-reactor>`_ for details.
