:title: go
:description: How to configure shippable.yml file for go 
:keywords: yml,go,test,tip

.. _langgo :

GO
===

This section helps you to create a shippable.yml file for your GO project.

- Tell us what your build environment is. This is an optional setting and if omitted Ubuntu 12.04 is used as a default.
    .. code-block:: python
        
        # Build Environment
        build_environment: ubuntu1204

- Set the appropriate language and the version number. You can test against multiple versions for a single push by adding more entries. GO minions use ``go`` by default to set the runtime platform.
	.. code-block:: python
	
     		# language setting
              language: go
        	# version numbers
	      go:
 		- 1.1
 		- 1.2
                - 1.3
 		- release
 		- tip

- Install dependencies for your project using the **install** key.
       .. code-block:: python

	      install:
                - go get github.com/onsi/gomega
                - go get github.com/onsi/ginkgo


- **Test scripts** : Use the **script** key in the shippable.yml file to specify what command to run tests with.
	.. code-block:: python

		# command to run tests
		script: go test -v ./... 
	

**Build Examples**

Want to see build examples? Reference our :ref:`GO build samples <go>`.
                                                                                           




