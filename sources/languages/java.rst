:title: java 
:description: How to configure shippable.yml file for java 
:keywords: yml,java,maven,oraclejdk6,openjdk6,oraclejdk7,openjdk7

.. _langjava :

Java 
======
This section helps you to create a shippable.yml file for your Java project.

- Tell us what your build environment is. This is an optional setting and if omitted Ubuntu 12.04 is used as a default.
    .. code-block:: python
        
        # Build Environment
        build_environment: ubuntu1204

- Set the appropriate language and the version number. You can test against Openjdk6, Openjdk7, Oraclejdk7 and Oraclejdk8 for a single push by adding more entries. Java minions use ``jdk`` by default to set the runtime platform.
	.. code-block:: python
	
     		# language setting
              language: java        
        	# jdk tag
	      jdk:
	       - openjdk7
	       - oraclejdk7
	       - openjdk6
	       - oraclejdk8

**Testing using Java build tool**

**Maven**

- If your repository root has pom.xml file, then our Java builder will use Maven 3 to build it. By default it will run the test using **mvn test**.
	
- Java builder will execute the below line to install project dependencies with Maven before it starts running tests. 
      .. code-block:: python
	
	     mvn install -DskipTests=true

**Gradle**

- If your repository root has "build.gradle", then our Java builder will use gradle to build it. By default it will use **gradle check** to run the test.

- Java builder will execute the below line to install the project dependencies with gradle.
      .. code-block:: python

	     gradle assemble	

**Ant**

- If your repository root does not have gradle or maven files, then our Java builder will use Ant to build it. By default it will use **Ant test** to run the test suite.

- Since there is no standard way to install Ant dependencies, you will need to specify the **install:** key to install your project dependencies with Ant.
       .. code-block:: python
           	
	       language: java
	       install: ant deps

Save the test output in shippable/testresults and the codecoverage output in shippable/codecoverage folder to get the reports parsed. If the test and codecoverage output is not saved as specified, you will not find the reports in our CI. 

**Build Examples**

Want to see build examples? Reference our :ref:`Java build samples <java>`.
