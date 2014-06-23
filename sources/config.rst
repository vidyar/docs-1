:title: Shippable Configuration
:description: Complete guide to how Shippable is setup
:keywords: shippable, signup, login, registration

.. _setup:

A bit deeper
============

Build Minions and Build configuration are two things that you should care the most about when using Shippable. The sections below talk about these in greater detail.


**Minions**
-----------

Minions are Docker based containers that run your builds and tests. You can think of them as Build VMs. Each minion runs one build at a time, so the more minions you have, the more concurrency you will get.  

We automatically create one minion for you when you first sign in to Shippable. Depending on your subscription, you can create more minions by going to Settings->Minions and clicking on the + sign.

Each minion starts from a base image and can be customized by specifying ``before_install`` scripts in the YML file. A minion can be configured to run any package, library, or service that your application requires. There are some preinstalled tools and services that you can use to customize your minions even further. 

Operating Systems
.................

All our Linux minions start from a vanilla base image from the Docker registry. We support all images as a starting point for your minion. Minions can be further customized by using the ``before_install`` and ``install`` tags in ``shippable.yml`` that is in the root of your code repository.

(Coming soon) Our Windows minions are based on AWS AMI for Windows 2012.

State Management
................

Shippable maintains the state of each minion between builds. We believe that build speed is very important, so reinstalling everything and cloning git repos every single time just doesn't make sense. 

(Coming soon) However, we also understand the value of testing on pristine environments. Hence we have a commit message tag [reset minion] which will reset your minion to its base setting and allow your test to run on a prisitne minion.


Common Tools
............

A set of common tools are available on all minions. The following is a list of available tools -

- Latest release of Git repository
- apt installer
- Networking tools  
  
  - curl
  - wget
  - OpenSSL

- At least 1 version of (check out the language documentation for specific versions)
  
  - Ruby
  - Node
  - Python 
  - OpenJDK
  - PHP
  - Go
  - Clojure

- Services
  
  - MySQL
  - Postgre
  - SQLLite
  - MongoDB
  - Redis
  - ElasticSearch
  - Selenium Server
  - Neo4j
  - Cassandra
  - CouchDB
  - RethinkDB

- Headless browser testing tools

  - xfvb
  - PhantomJS

- Libraries

  - ImageMagik
  - OpenSSL

- JDK Versions

  - Oracle JDK 7u6 (oraclejdk7)
  - OpenJDK 7 (alias: openjdk7)
  - OpenJDK 6 (openjdk6)
  - Oracle JDK 8 EA (oraclejdk8)

- Build Tools

  - Maven 3
  - Gradle 1.9
  - Make
  - SBT 0.12.1

- Preinstalled PIP Packages

  - mock
  - nosetests
  - py.test

- Gems

  - Bundler
  - Rake
 
- Addons
  
  - Firefox
  - Custom hostname
  - PostgreSQL

----------

**Configuration**
------------------

This section is generic to all build environments and all languages. If you are looking for language specific tags, please refer to our language guides for more information.

``shippable.yml``
.................

We believe that developers need complete control of their build configuration. We also realize that most developers don't want to log into a UI to make changes every single time. 

While mulling over the best way to give developers control without asking them to go through our UI, we came across ``.travis.yml``, an open source initiative that created the basic framework for this very problem. Following the same paradigm, we ask you to have ``shippable.yml`` in the root of the repository you want to build. The structure of shippable.yml closely mimics travis since we see no reason to reinvent the wheel. We do have additional tags for added functionality, and these will become more numerous as we evolve Shippable. 

Since shippable.yml is a superset of ``.travis.yml`` , we support ``.travis.yml`` natively as well. So if you have a travis.yml in the root of your repo, we will read the config and set up your CI.

At a minimum, Shippable needs to have your language and build version specified in the yml. We will then default to the most common commands.

Build Flow
..........

When we receive a build trigger through a webhook or manual run, we execute the following steps - 

1. Clone/Pull the project from Github. This depends on whether the minion is in pristine state or not
2. ``cd`` into the workspace
3. Checkout the commit that is getting built
4. Run the ``before_install`` section. This is typically used to prep your minion and update any packages
5. Run ``install`` section to install any project specific libraries or packages
6. Run ``before_script`` section to create any folders and unzip files that might be needed for testing. Some users also restore DBs etc. here
7. Run the ``script`` command which runs build and all your tests
8. Run either ``after_success`` or ``after_failure`` commands
9. Run ``after_script`` commands

The outcome of all the steps upto 7 determine the outcome of the build status. They need to return an exit code of ``0`` to be marked as success. Everything else is treated as a failure.


----------

**Other useful configs**
------------------------

Shippable uses Docker containers to provide you with isolation and a dedicated build environment. Our command sessions are not sticky throughout the build, but they are sticky within the same section of the build. For e.g. ``cd`` is sticky within the ``before_script`` tag of ``shippable.yml``

script
......
You can run any script file as part of your configuration, as long as it has a valid shebang command and the right ``chmod`` permissions. 

.. code-block:: python
        
        # script file 
        script: ./minions/do_something.sh 



command collections
...................
``shippable.yml`` supports collections under each tag. This is nothing more than YML functionality and we will run it one command at a time.

.. code-block:: python
        
  # collection scripts 
  script: 
   - ./minions/do_something.sh 
   - ./minions/do_something_else.sh 

In the example above, our minions will run ``./minions/do_something.sh`` and then run ``./minions/do_something-else.sh``. The only requirement is that all of these operations return a ``0`` exit code. Else the build will fail.


git submodules
..............
Shippable supports git submodules. This is a cool functionality of breaking your projects down into manageable chunks. We automatically initialize the ``.gitmodules`` file in the root of the repo. 

.. note::

  If you are using private repos, add the deploy keys so that our minion ssh keys are allowed to pull from the repo. This can be done via shippable.com

If its your own public repos then do this

.. code-block:: python
        
  # for public modules use
  git://github.com/someuser/somelibrary.git

  # for private modules use
  git@github.com:someuser/somelibrary.git

If you would like to turn submodules off completely -

.. code-block:: python
        
  # for public modules use
  git:
   submodules: false

common environment variables
.............................

You will have the following environment variables available to you for every build. You can use these in your scripts if required -

- BRANCH : Name of branch being built

- BUILD_NUMBER : Build number for current build

- BUILD_URL : Direct URL link to the Build Output

- COMMIT : Commit id that is being built and tested

- DEBIAN_FRONTEND : noninteractive

- JOB_ID : id of job in Shippable

- JRUBY_OPTS : --server -Dcext.enabled=false -Xcompile.invokedynamic=false

- LANG : en_US.UTF-8

- LC_ALL : en_US.UTF-8

- MERB_ENV : test

- PULL_REQUEST : Pull request id if the job is a pull request. If not, this will be set to 'none'

- RACK_ENV : test

- RAILS_ENV : test

- USER : shippable

user specified environment variables
.....................................

You can set your own environment variables in the yml. Every statement of this command will trigger a separate build with that specific version of the environment variables. 

.. code-block:: python
        
  # environment variable
  env:
   - FOO=foo BAR=bar
   - FOO=bar BAR=foo


.. note::

  Env variables can create an exponential number of builds when comined with ``jdk`` & ``rvm, node_js etc.`` i.e. it is multiplicative

In this setting **4 builds** are triggered

.. code-block:: python
        
  # npm builds
  node_js:
    - 0.10.24
    - 0.8.14
  env:
    - FOO=foo BAR=bar
    - FOO=bar BAR=foo

.. _secure_env_variables:

Secure environment variables
.............................

Shippable allows you to encrypt the environment variable definitions and keep your configurations private using **secure** tag. Go to settings -> Repositories -> click on the enabled project name -> and select Secure variables tab. Enter the env variable and its value in the text box as shown below. 

.. code-block:: python

    name=abc

Click on the encrypt button and copy the encrypted output string and add it to your yml file as shown below:


.. code-block:: python
   
   env:
     secure: <encrypted output>


To encrypt multiple environment variables and use them as part of a single build, enter the environment variable definitions in the text box as shown below 

.. code-block:: python

  name1="abc" name2="xyz"    

This will give you a single encrypted output that you can embed in your yml file.


You can also combine encrypted output and clear text environments using **global** tag. 

.. code-block:: python
 
   env:
     global:
       - FOO="bar"
       - secure: <encrypted output>


To encrypt multiple environment variables separately, configure your yml file as shown below: 

.. code-block:: python
  
  env:
    global:
      #encrypted output of first env variable
      - secure: <encrypted output> 
      #encrypted output of second env variable
      - secure: <encrypted output>
    matrix:
      #encrypted output of third env variable
      - secure: <encrypted output>


include & exclude branches
..........................

You can build specific branches or exclude them if needed. 

.. code-block:: python

  # exclude
  branches:
    except:
      - test1
      - experiment2

  # include
  branches:
    only:
      - stage
      - prod


build matrix
............

This is another powerful feature that Shippable has to offer. You can trigger multiple different test passes for a single code push. You might want to test against different versions of ruby, or different aspect ratios for your Selenium tests or best yet, just different jdk versions. You can do it all with Shippable's matrix build mechanism.

.. code-block:: python

  rvm:
    - 1.8.7 # (current default)
    - 1.9.2
    - 1.9.3
    - rbx
    - jruby
    - ruby-head
    - ree
  gemfile:
    - gemfiles/Gemfile.rails-2.3.x
    - gemfiles/Gemfile.rails-3.0.x
    - gemfiles/Gemfile.rails-3.1.x
    - gemfiles/Gemfile.rails-edge
  env:
    - ISOLATED=true
    - ISOLATED=false

The above example will fire 36 different builds for each push. Whoa! Need more minions?
 

**exclude**

It is also possible to exclude a specific version using exclude tag. Configure your yml file as shown below to exclude a specific version.

.. code-block:: python

   matrix:
     exclude:
       - rvm: 1.9.2
        


**include**

You can also configure your yml file to include entries into the matrix with include tag.

.. code-block:: python

   matrix:
     include:
       - rvm: 2.0.0
         gemfile: gemfiles/Gemfile.rails-3.0.x
         env: ISOLATED=false


**allow-failures**

Allowed failures are items in your build matrix that are allowed to fail without causing the entire build to be shown as failed. You can define allowed failures in the build matrix as follows:

.. code-block:: python

  matrix:
    allow_failures:
      - rvm: 1.9.3



----------

**Services**
-----------------
Shippable offers a host of pre-installed services to make it easy to run your builds. In addition to these you can install other services also by using the ``install`` tag of ``shippable.yml``. 

All the services are turned off by default and can be turned on by using the ``services:`` tag.

MongoDB
.......

.. code-block:: bash
  
  # Mongo binds to 127.0.0.1 by default
  services:
   - mongodb

Sample PHP code using `mongodb <https://github.com/Shippable/sample_php_mongo>`_ .


MySQL
.....

.. code-block:: bash
  
  # MySQL binds to 127.0.0.1 by default and is started on boot. Default username is shippable with no password
  # Create a DB as part of before script to use it

  before_script:
      - mysql -e 'create database myapp_test;'
                                 
Sample javascript code using `mysql <https://github.com/Shippable/sample_node_mysql>`_.


SQLite3
.......

SQLite is a software library that implements a self-contained, serverless, zero-configuration, transactional SQL database engine. So you can use SQLite, if you do not want to test your code behaviour with other databases.

Sample python code using `SQLite <https://github.com/Shippable/sample_python_sqllite>`_.


Elastic Search
..............

.. code-block:: bash

  #elastic search is on default port 9200
  services:
      - elasticsearch

Sample python code using `Elastic Search <https://github.com/Shippable/sample_python_elasticsearch>`_.

Memcached
..........

.. code-block:: bash

  #memcache runs on default port 11211
  services:
      - memcached

Sample python code using `Memcached <https://github.com/Shippable/sample_python_memcache>`_ .


Redis
.....

.. code-block:: bash

  #redis runs on default port 6379
  services:
      - redis


Sample python code using `Redis <https://github.com/Shippable/sample_python_redis>`_.


Neo4j
.....

.. code-block:: bash
 
 #neo4j runs on default port 7474
 services:
  - neo4j

Sample javascript code using `Neo4j <https://github.com/Shippable/sample_node_neo4j>`_ .

Cassandra
..........

.. code-block:: bash
 
 #cassandra binds to the default localhost 127.0.0.1 and is not started on boot. 
 services:
   - cassandra

Sample ruby code using `Cassandra <https://github.com/Shippable/sample_ruby_cassandra>`_.

--------

**Addons**
----------

firefox
..........

We support different firefox versions like "18.0", "19.0", "20.0", "21.0", "22.0", "23.0", "24.0", "25.0", "26.0", "27.0", "28.0", "29.0". To select a specific firefox version, add the following to your shippable.yml file.

.. code-block:: python

	addons:
  	   firefox: "21.0"

custom host name
..................

You can also set up custom hostnames using the **hosts** addons. To set up the hostnames in /etc/hosts file, add the following to your shippable.yml file.
   
.. code-block:: python

        addons:
           hosts: 
    	    - google.com
            - asdf.com

PostgreSQL
...........

.. code-block:: bash

  # Postgre binds to 127.0.0.1 by default and is started on boot. Default username is "postgres" with no password
  # Create a DB as part of before script to use it

  before_script:
    - psql -c 'create database myapp_test;' -U postgres

Sample java code using `PostgreSQL <https://github.com/Shippable/sample_java_postgres>`_.

We support PostgreSQL 9.1, 9.2 and 9.3 versions and by default, version 9.2 is installed on our minions. Configure your yml file using **PostgreSQL** addons to select different versions. Add the following to your yml file to select the version 9.3.


.. code-block:: python

          addons:
           postgresql : "9.3"
  
PostGIS 2.1 packages are pre-installed in our minions along with the PostgreSQL versions 9.1, 9.2 and 9.3.


----------

**Test and Code Coverage visualization**
----------------------------------------
Test results
............
To set up test result visualization for a repository.

* Output test results to shippable/testresults folder. 
* Make sure test results are in junit format.

For example, here is the .yml file for a Python repo -

.. code-block:: bash

  before_script: mkdir -p shippable/testresults
  script:
    - nosetests python/sample.py --with-xunit --xunit-file=shippable/testresults/nosetests.xml

Examples for other languages can be found in our :ref:`Code Samples <samplesref>` .

Code coverage
.............
To set up test result visualization for a repository.

* Output code coverage output to shippable/codecoverage folder. 
* Make sure code coverage output is in cobertura xml format.

For example, here is the .yml file for a Python repo -

.. code-block:: bash

  before_script: mkdir -p shippable/codecoverage
  script:
    - coverage run --branch python/sample.py
    - coverage xml -o shippable/codecoverage/coverage.xml python/sample.py

Examples for other languages can be found in our :ref:`Code Samples <samplesref>`.

----------

**Notifications**
-----------------
Shippable can notify you about the status of your build. If you want to get notified about the build status (success, failure or unstable), you need to follow the rules below to configure your yml file. Shippable will send the consolidated build reports in individual emails for matrix build projects. By default Shippable will send the email notifications to the last committer.


Email notification
..................


You can configure the email notification by specifying the recipients id in ``shippable.yml`` file.

.. code-block:: bash

  notifications:
      email:
          - exampleone@org.com
          - exampletwo@org.com


You can also specify when you want to get notified using change|always|never. Change means you want to be notified only when the build status changes on the given branch. Always and never mean you want to be notified always or never respectively.


.. code-block:: bash
 
  notifications:
       email:
           recipients:
               - exampleone@org.com
               - exampletwo@org.com
           on_success: change
           on_failure: always


If you do not want to get notified, you can configure email notifications to false.

.. code-block:: bash

  notifications:
     email: false


----------

**Continuous deployment**
-------------------------

Continuous deployment to Heroku
................................

Heroku supports Ruby, Node.js, Python, so you can use these languages to build and deploy apps on Heroku. You can deploy to your own server by adding a custom after_success:. For this you need to add the Public key that was generated for your subscription in Shippable to set up continous deployment on providers.

* Go to settings and copy the SSH Key or public key generated for your subscription.
* Log In to Heroku and add the SSH key to your account 


A sample deployment configuration in your shippable.yml file is given below

.. code-block:: bash

  after_success :
    - git push  git@heroku.com:shroudd-headland-1758.git master


You need to copy the Git URL from your project for deployment in Heroku.

* Go to apps and select your project
* Go to the settings page of your project and copy the Git URL
* Add it to the shippable.yml file

.. code-block :: bash

  after_success :
    - git push git@heroku.com:shroudd-headland-1758.git master


Continuous deployment to Amazon Elastic Beanstalk
.................................................

Amazon Elastic Beanstalk features predefined runtime environments for Java, Node.js, PHP, Python and Ruby, so it is possible to configure Shippable minions to automatically deploy applications targeting these environments. Moreover, Elastic Beanstalk also support defining custom runtime environments via Docker containers, giving the developer full flexibility in the configuration of technology stack. However, as the standard, pre-packaged environments are far easier to set up and cover nearly all languages currently supported by Shippable (except for Go), we will concentrate on how to integrate with Amazon Elastic Beanstalk using the former option.

To interact with Elastic Beanstalk, one needs to use command line tools supplied by Amazon, from which the most commonly used is ``eb`` command. These tools must be available to Shippable in order to perform deployment. The easiest way of doing so is to include the tool in your repository. Additionally, some of the subcommands, e.g. ``eb init`` are interactive-only (they require console input), rendering them impossible to use in automated builds. Thus, we recommend our modified Elastic Beanstalk tools that are free of this limitation. You can add them as git submodule to your project as follows:

.. code-block :: bash

  git submodule add git://github.com/Shippable/elastic-beanstalk-tools.git

You also need to obtain Access Key to connect ``eb`` tool with Elastic Beanstalk API. Please refer to `this documentation <http://docs.aws.amazon.com/general/latest/gr/getting-aws-sec-creds.html>`_ for details on obtaining the keys. It is recommended to save your access key as secret in Shippable, as is discussed in :ref:`secure_env_variables`. To use code from this tutorial, store the secret access key variable as ``AWSSecretKey``. It is safe to keep your access key id in plain text.

After having the basic setup done, it is time to create an application in Elastic Beanstalk. You can use Web GUI for this task, by going to the main page in the Elastic Beanstalk console, and then choosing 'Create a New Application' button in the sidebar. After entering name for application, proceed to define an environment. After creating and launching the environment, create a file in your repository called ``config`` with your settings, where ``DevToolsEndpoint`` is based on the AWS region you are using:

.. code-block :: bash

  [global]
  ApplicationName=bean-test
  DevToolsEndpoint=git.elasticbeanstalk.us-west-2.amazonaws.com
  EnvironmentName=bean-env
  Region=us-west-2
  ServiceEndpoint=https://elasticbeanstalk.us-west-2.amazonaws.com

In the runtime environment, RDS database connection details are injected by Elastic Beanstalk as environment variables. It is secure and convenient, as we do not need to store them in any other place. However, during tests on Shippable, we need to supply the same variables with values correct for Shippable minion in ``shippable.yml`` (please note the ``secure`` definition for our AWS access key):

.. code-block :: bash

  env:
    global:
      - RDS_HOSTNAME=127.0.0.1 RDS_USERNAME=shippable RDS_PASSWORD="" RDS_DB_NAME=test RDS_PORT=3306
      - secure: K7qw2XSFBaW+zEzrs0ODKMQq/Bo9AZqGotCXc50fao+et6WaxEmedlK//MO9JozmPdcxDRq5k8A0pmjTLsMLstkh7PUFLu3Z6xowU2OhMyjQ0pS2J8Hw16SgZ9n2EW+3cps4dIijEzOwjA0Yx5rTOC7F9N8nvr/1l4Yp4i11qgW08cefEKuwiF/ypgrkK5BYJyJreZOEJt3lJ6/aXyXxPPl3X3Z+L+ca9mQmTN6q1wnlEcYLDU5EJtkk87KtOfVyoi/+aOFh49eDpwStSD4zDnygia8eAnCGK/p0XGFJCAwWK1nnFY7aklJrvElD+V/2lbr14TwF0rhmiba6Y6ylnw==

Then, we need to add some steps to ``shippable.yml`` to update ``eb`` configuration and then launch it after successful build. Remember to replace value for ``AWSAccessKeyId`` with the one downloaded from your AWS Management Console:

.. code-block :: bash

  before_script: 
    - mkdir -p ~/.elasticbeanstalk
    - echo 'AWSAccessKeyId=AKIAJSZ63DT' >> ~/.elasticbeanstalk/aws_credential_file
    - echo 'AWSSecretKey='$AWSSecretKey >> ~/.elasticbeanstalk/aws_credential_file

  script:
    - mkdir -p .elasticbeanstalk
    - cp config .elasticbeanstalk/

  after_success :
    - export PATH=$PATH:$PWD/aws/eb/linux/python2.7/ && virtualenv ve && source ve/bin/activate && pip install -r aws/requirements.txt && eb init && eb push

Finally, we can connect to the database using environment variables as defined above.

**PHP:**

.. code-block :: php

  $con = mysqli_connect(
    $_SERVER['RDS_HOSTNAME'],
    $_SERVER['RDS_USERNAME'],
    $_SERVER['RDS_PASSWORD'],
    $_SERVER['RDS_DB_NAME'],
    $_SERVER['RDS_PORT']
  );            

Full sample PHP code using Elastic Beanstalk is available `on GitHub <https://github.com/Shippable/sample-php-mysql-beanstalk>`_.

**Ruby:**

.. code-block :: ruby

  con = Mysql2::Client.new(
    :host => ENV['RDS_HOSTNAME'],
    :username => ENV['RDS_USERNAME'],
    :password => ENV['RDS_PASSWORD'],
    :port => ENV['RDS_PORT'],
    :database => ENV['RDS_DB_NAME']
  )

Full sample Ruby code using Elastic Beanstalk is available `on GitHub <https://github.com/Shippable/sample-ruby-mysql-beanstalk>`_.

**Python:**

.. code-block :: python

  self.db = MySQLdb.connect(
    host = os.environ['RDS_HOSTNAME'],
    user = os.environ['RDS_USERNAME'],
    passwd = os.environ['RDS_PASSWORD'],
    port = int(os.environ['RDS_PORT']),
    db = os.environ['RDS_DB_NAME'])

As Python projects are already run in ``virtualenv`` on Shippable minions, change the ``after_success`` step from the end of the general description above to:

.. code-block :: python

  after_success :
    - export PATH=$PATH:$PWD/aws/eb/linux/python2.7/ && pip install -r aws/requirements.txt && eb init && eb push

Full sample Python code using Elastic Beanstalk is available `on GitHub <https://github.com/Shippable/sample-python-mysql-beanstalk>`_.


----------

**Pull Request**
----------------


Shippable will integrate with github to show your pull request status on CI. Whenever a pull request is opened for your repo, we will run the build for the respective pull request and notify you about the status. You can decide whether to merge the request or not, based on the status shown. If you accept the pull request, Shippable will run one more build for the merged repo and will send email notifications for the merged repo.

 
--------

**Collaborators**
------------------

Shippable will automatically add your github collaborators when you create a project and by default they will be assigned the role of **Build engineer**. You can see the list of collaborators or change their role by expanding your repo on the settings page.


There are two types of roles that users can have -

**Owner :** 
Owner is the highest role. This role permits users to create, run and delete a project. 


**Collaborators :** 
Collaborators can run or manage projects that are already setup. They have full visibility into the project and can trigger the build.


--------

**Build Termination**
-----------------------


If your script or test suite hangs for a long time or there hasn't been any log output in 20 minutes, then Shippable will forcefully terminate the build and add a message to the console log.

