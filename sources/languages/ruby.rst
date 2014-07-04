:title: Ruby
:description: Language specific guide for Ruby
:keywords: containers, lxc, concepts, explanation, image, minion, shippable, Ruby

.. _langruby:

Ruby
====

This section helps you to set the build environment and other configuration specific to Ruby projects.

**Ruby versions for testing** :

- Tell us what your build environment is. This is an optional setting and if omitted Ubuntu 12.04 is used as the default
    .. code-block:: python
        
        # Build Environment
        build_environment: ubuntu1204

- Set the appropriate language and version number. You can test against multiple versions for a single push by adding more entries. Ruby minions use ``rvm`` by default to set the version
    .. code-block:: python
        
        # language setting
        language: ruby

        # version numbers
        rvm:
         - 1.8.7
         - 1.9.2
         - 1.9.3
         - 2.0.0
         - 2.1.0
         - 2.1.1
         - 2.1.2
         - jruby-18mode
         - jruby-19mode
         - rbx
         - ruby-head
         - jruby-head
         - ree
	
.. note::
 We are setting multiple versions of Ruby here which means a single push to repo will trigger multiple builds. 

- Though we pre-install only a few versions of Ruby, all versions of Ruby are supported. As long as they are available as a binary for Ubuntu 12.04, you can specify custom patchlevels.
    .. code-block:: python
        
        language: ruby
        rvm: 2.0.0-p247

.. note::
 This binds you to potentially unsupported releases of Ruby. It also extends your build time as downloading and installing a custom Ruby can add an extra 60 seconds or more to your build the first time it installs.

We are using Bundler, ``bundle install`` to install all your gems. We also use ``rake`` by default to run your build and hence you need to specify it in your gemfile

- If you are using a custom gemfile thats not in default location you can specify it with the ``gemfile`` tag
    .. code-block:: python
        
        # gemfile tag
        gemfile: gemfiles/Gemfile.ci

.. note::
 If you specify multiple gemfiles in the above tag, a matrix build is triggered for every version of the gemfile.


- Additional arguments can be added to ``bundle install`` command and we will append them to the default command
    .. code-block:: python
        
        # bundle_args 
        bundler_args: --binstubs

- If you want to run some other commands before install you can do this
    .. code-block:: python
        
        # before_install tag
        before_install: gem install bundler --pre

- You can also set multiple environment variables and test against multiple different versions by using the env variable in your code. This will fire 3 different builds, one for each env variable
    .. code-block:: python
        
        # env tag
		env:
		 - CHEF_VERSION=0.9.18
		 - CHEF_VERSION=0.10.2
		 - CHEF_VERSION=0.10.4

- You can also test against multiple ``jdk`` versions
    .. code-block:: python
        
        # jdk tag
		jdk:
                 - openjdk7
		 - oraclejdk7
		 - openjdk6
                

- You can also update the versions on your minion by running a simple command or even downgrade if you choose to. The script below demonstrates an upgrade and downgrade -
    .. code-block:: python
        
		before_install:
		 - gem update --system
  		 - gem --version
		 - gem update --system 2.1.11
  		 - gem --version

**Build Examples**

Want to see build examples? Reference our :ref:`Ruby build samples <ruby>`.
