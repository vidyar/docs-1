:title: php 
:description: How to configure shippable.yml file for php 
:keywords: yml,php,composer,phpunit

.. _langphp:

PHP
======
This section helps you to create a shippable.yml file for your php project.


- Set the appropriate language and the version number. You can test against multiple versions for a single push by adding more entries. PHP minions use ``php`` by default to set the runtime platform.
	.. code-block:: python
	
     		# language setting
              language: php
        	# php tag
	      php:
	       - 5.3
	       - 5.4
               - 5.5
	       - 5.6
	       - hhvm

**Test scripts**

- Use the script key in shippable.yml file to specify what command to run tests with.  
	.. code-block:: bash
		
		script: phpunit UnitTest


.. note::
 Runs the tests that are provided by the class UnitTest. This class is expected to be declared in the UnitTest.php sourcefile.  


**PHP extensions**

Our minions are pre-installed with the following PHP extensions.

1. `amqp.so <http://php.net/amqp>`_
2. `apc.so <http://php.net/apc>`_ 
3. `memcache.so <http://php.net/memcache>`_
4.  `memcached.so <http://php.net/memcached>`_
5. `mongo.so <http://php.net/mongo>`_
6. `redis.so <http://pecl.php.net/package/redis>`_
7. `xdebug.so <http://xdebug.org/>`_
8. `zmq.so <http://in1.php.net/manual/en/book.zmq.php>`_
 
You will have to add **extension=<extension>.so** to php.ini file to enable the extension. For example, configure your yml file as shown below to enable redis.so.

.. code-block:: python

	echo "extension = redis.so" >> ~/.phpenv/versions/$(phpenv version-name)/etc/php.ini


It is also possible to install custom PHP extensions using `PECL <http://pecl.php.net/>`_. 

.. code-block:: python

       pecl install <extension>

PECL will automatically enable the extension at the end of the installation.

**Build Examples**

Want to see build examples? Reference our :ref:`PHP build samples <php>`.
