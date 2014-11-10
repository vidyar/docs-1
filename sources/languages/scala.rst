:title: scala 
:description: configuring yml file for scala
:keywords: scala,SBT,OracleJDK6,OracleJDK7,OpenJDK6,OpenJDK7 

.. _langscala:

Scala 
======

This section helps you specify the build environment and other configuration specific to Scala projects.


- Set the appropriate language and version number. You can test against multiple versions for a single push by adding more entries. Scala minions use ``scala`` by default to set the version.
  
- We support SBT, oraclejdk8, oraclejdk7, openjdk6 and openjdk7. Specify Scala versions like 2.8.x, 2.9.x and 2.10.x in the shippable.yml file as shown below.
    .. code-block:: python
	
	language: scala
	scala:
   	   - 2.8.2
   	   - 2.9.2

- Scala builder assumes dependency management based on projects like Maven, Gradle or SBT and it will pull down project dependencies automatically before running tests.

- To test against multiple JDKs, use jdk tags. For example, to test against the oraclejdk8, oraclejdk7, openjdk6 and openjdk7
	.. code-block:: bash

	      jdk:
		- oraclejdk8
  		- oraclejdk7
  	        - openjdk6
		- openjdk7

**SBT projects :**

- If your repository root has **Project** directory or build.sbt file, then our scala builder will run the test suite using 
    .. code-block:: python

      sbt ++$SHIPPABLE_SCALA_VERSION test 

**Build Examples**

Want to see build examples? Reference our :ref:`Scala build samples <scala>`.
