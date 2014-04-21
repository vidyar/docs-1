:title: php 
:description: How to configure shippable.yml file for php 
:keywords: yml,php,composer,phpunit

.. _langphp:

PHP
======
This section helps you to create a shippable.yml file for your php project.

- Tell us what your build environment is. This is an optional setting and if omitted Ubuntu 12.04 is used as a default.
    .. code-block:: python
        
        # Build Environment
        build_environment: ubuntu1204

- Set the appropriate language and the version number. You can test against multiple versions for a single push by adding more entries. PHP minions use ``php`` by default to set the runtime platform.
	.. code-block:: python
	
     		# language setting
              language: php
        	# php tag
	      php:
	       - 5.2
	       - 5.3
	       - 5.4
               - 5.5

**Test scripts**

- Use the script key in shippable.yml file to specify what command to run tests with.  
	.. code-block:: bash
		
		script: phpunit UnitTest


.. note::
 Runs the tests that are provided by the class UnitTest. This class is expected to be declared in the UnitTest.php sourcefile.  

