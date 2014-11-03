:title: Continuous deployment configuration
:description: Setting up continuous deployment
:keywords: shippable, Heroku, Amazon Elastic Beanstalk, AWS OpsWorks


.. _continuous_deployment: 


Continuous deployment
==========================

Shippable allows you to deploy your applications to any PaaS providers like Heroku, Amazon Elastic Beanstalk, AWS OpsWorks, Google App Engine, Red Hat OpenShift or any infrastructure provider after a successful build. The section below will give you more details.



**Continuous deployment to Heroku**
----------------------------------------

Heroku supports Ruby, Java, Python, Node.js, PHP, Clojure and Scala (with special support for Play Framework), so you can use these technologies to build and deploy apps on Heroku.
There are two methods of deploying your applications to Heroku: using Heroku toolbelt or plain git command only.

Without Heroku toolbelt
^^^^^^^^^^^^^^^^^^^^^^^

To be able to push your code to Heroku, you need to add SSH public key associated with your Shippable account to authorized keys in `Heroku Account Settings <https://dashboard.heroku.com/account>`_.
In Shippable, go to 'Settings' and choose 'Deployment key' tab. Copy the contents of the key and add it in 'SSH keys' section of Heroku settings.

Next, create your Heroku application using Web GUI or ``heroku`` command installed on your workstation.

* Go to your app's settings page.
* In the application info pane (that is also displayed at the end of the application creation process) you will see 'Git URL'.
* Just use it to push the code in ``after_success`` step of Shippable build:

.. code-block:: bash

  env:
    global:
      - APP_NAME=shroudd-headland-1758

  after_success :
    - git push -f git@heroku.com:$APP_NAME.git master

Full sample of deploying PHP+MySQL application to Heroku without using toolbelt can be found on `our GitHub account <https://github.com/shippableSamples/sample-php-mysql-heroku/tree/without-toolbelt>`_.

.. note::

  If you happen to build other branches than ``master``, please see :ref:`heroku_other_branches` for details.

With Heroku toolbelt
^^^^^^^^^^^^^^^^^^^^

In some circumstances, you may choose to use Heroku toolbelt to deploy your application. For example, you may want to execute Rake commands straight from your Shippable build (like ``heroku run rake db:migrate``).

To use Heroku toolbelt, you first need to obtain API key for your account. Go to your `account settings <https://dashboard.heroku.com/account>`_ and copy it from 'API Key' section.
It is recommended to save your access key as secret in Shippable, as is discussed in :ref:`secure_env_variables`. Encrypt your variable as ``HEROKU_API_KEY=<your key here>`` and paste the encrypted secret in ``shippable.yml`` as follows:

.. code-block:: bash

  env:
    global:
      - APP_NAME=shroudd-headland-1758
      - secure: MRuHkLbL9HPkJPU5lzkKM1+NOq1S5RrhxEyhJkk60xxYiF7DMzydiBN8oFBjWrSmyGeGRuEC22a0I5ItobdWVszfcJCaXHwtfKzfGOUdKuyCnDgvojXhv/jrBvULyLK6zsLw3b8NMxdnwNsHqSPm19qW/EIGEl9Zv/637Igos69z9aT7+xrEG013+6HtKYb8RHm+iPSNsFoBi/RSAHYuM1eLTZWG2WAkjgzZaYmrHCgNwVmk+HOGR+TOWN7Iu5lrjyvC1XDCQrOvo1hZI30cd9OqJ5aadFm3exQpNhI4I7AgOnCbK3NoWNc/GAnqKXCvsaIQ80Jd/uLIOVyMjD6Xmg==

.. note::

  If your build times out during ``after_success`` step, please double check that you correctly defined ``HEROKU_API_KEY`` variable.
  If no key is supplied, Heroku toolbelt will switch to an interactive mode, prompting for the username and causing the build to 'hang'.

Then, install the toolbelt in ``before_install`` step (``which heroku`` is for skipping this step if the tools are already installed):

.. code-block:: bash

  before_install:
    - which heroku || wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh

Next, create your Heroku application using Web GUI or ``heroku`` command installed on your workstation. Then, add the following ``after_success`` step to your Shippable build: 

.. code-block:: bash

  after_success:
    - test -f ~/.ssh/id_rsa.heroku || ssh-keygen -y -f ~/.ssh/id_rsa > ~/.ssh/id_rsa.heroku && heroku keys:add ~/.ssh/id_rsa.heroku
    - git remote -v | grep ^heroku || heroku git:remote --app $APP_NAME
    - git push -f heroku master

* First we generate public SSH key out of the private one to a file with a custom name. We then authorize this key with Heroku. Using custom name for the file allows us to skip this step on subsequent builds.
  Please note that we need to use ``test -f ...`` instead of ``[ -f ... ]`` here, as the latter would be interpreted by YAML parser
* Then, we make sure ``heroku`` remote is added to the local git repository
* Finally, we push the code to Heroku

Please refer to the sections below for language-specific details of configuring Heroku builds.

.. note::

  If you happen to build other branches than ``master``, please see :ref:`heroku_other_branches` for details.

.. _heroku_other_branches:

Deploying from branches other than master
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Heroku always deploys contents of ``master`` branch, so if you happen to deploy code from other branches, `the Heroku documentation <https://devcenter.heroku.com/articles/git#deploying-code>`_
instructs you to use the following syntax:

.. code-block:: bash

  - git push -f heroku yourbranch:master

During the build, you can access the name of the branch as ``BRANCH`` variable, so the invocation would look as follows.
We are forcing push here, as it can happen that builds (and pushes) can alternate between the branches, so plain push
would fail due to divergent histories.

.. code-block:: bash

  - git push -f heroku $BRANCH:master

Using ClearDB MySQL database
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Heroku passes ClearDB MySQL connection details as an environment variable called ``CLEARDB_DATABASE_URL`` containing connection URL.
To mock it with the test database during build, add the following environment variable in your ``shippable.yml`` config:

.. code-block:: bash

  env:
    global:
      - CLEARDB_DATABASE_URL=mysql://shippable@127.0.0.1:3306/test?reconnect=true

Then, in your application you need to retrieve and parse the url. For example, in PHP:

.. code-block:: php

    $url = parse_url(getenv("CLEARDB_DATABASE_URL"));
    $host = $url["host"];
    $username = $url["user"];
    $password = array_key_exists("pass", $url) ? $url["pass"] : "";
    $db = substr($url["path"], 1);

    $con = mysqli_connect($host, $username, $password, $db);

Please refer to `Heroku docs <https://devcenter.heroku.com/articles/cleardb>`_ for details on how to fetch and parse the url in different programming languages.
Full sample of deploying PHP+MySQL application to Heroku (using Heroku toolbelt) can be found on `our GitHub account <https://github.com/shippableSamples/sample-php-mysql-heroku>`_.

Using Heroku Postgres with Ruby on Rails
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Configuring Ruby on Rails application to work with Postgres on Heroku is really simple, thanks to Heroku doing all heavy-lifting related to setting up the connection.
When Heroku detects that the application you deploy is using Ruby on Rails, it will overwrite ``config/database.yml`` file with correct production configuration.

On Shippable, Postgres in version 9.3 is started by default during minion boot. To use different version of Postgres, please refer to the
dedicated section on PostgreSQL configuration.

All we need to do is to create a database in the ``before_script`` step:

.. code-block:: bash

  before_script: 
    - mkdir -p shippable/testresults
    - mkdir -p shippable/codecoverage
    - psql -c 'create database "sample-rubyonrails-postgres-heroku_test";' -U postgres

And then include its name in ``config/database.yml`` file that is stored in the repository (username and password do not need to be configured):

.. code-block:: bash

  test:
    <<: *default
  database: sample-rubyonrails-postgres-heroku_test

The last thing to do is to add ``pg`` to your ``Gemfile``. Note that it will be done automatically if you create your rails app with ``--database=postgresql`` option.
See `our sample Ruby on Rails Heroku application <https://github.com/shippableSamples/sample-rubyonrails-postgres-heroku>`_ for details.

Test and coverage reports for Ruby on Rails
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In Rails 4 and Ruby 1.9+, the built-in test framework is based on Minitest.
To enable Shippable-compatible reporting of test and coverage reports, we need to add the following gems to the ``Gemfile``:

.. code-block:: bash

  gem 'simplecov'
  gem 'simplecov-csv'
  gem 'minitest-reporters'

Then, add the following snippet at the beginning of the ``test/test_helper.rb`` file:

.. code-block:: bash

  require 'minitest/reporters'
  require 'simplecov'
  require 'simplecov-csv'
  SimpleCov.formatter = SimpleCov::Formatter::CSVFormatter
  SimpleCov.coverage_dir(ENV["COVERAGE_REPORTS"])
  SimpleCov.start

  MiniTest::Reporters.use! [MiniTest::Reporters::DefaultReporter.new,
                            MiniTest::Reporters::JUnitReporter.new(ENV["CI_REPORTS"])]

Finally, we need to add environment variables with the locations for the reporter results:

.. code-block:: bash

  env:
    global:
      - CI_REPORTS=shippable/testresults COVERAGE_REPORTS=shippable/codecoverage

See `our sample Ruby on Rails Heroku application <https://github.com/shippableSamples/sample-rubyonrails-postgres-heroku>`_ for details.

General information on using MongoDB
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

You have two addons to choose from when using MongoDB on Heroku: MongoLab and MongoHQ. Setup for both of them with Shippable is the same.
The only difference is the name of the environment variable that contains connection details:

* For MongoLab it is called ``MONGOLAB_URI``
* For MongoHQ the name of the variable is ``MONGOHQ_URL``

Examples below use MongoLab for consistency, but adapting them to MongoHQ is as simple as substituting all occurrences of this variable.

To start using MongoDB, first add the addon of your choice to your Heroku application. 

In your ``shippable.yml`` you first need to tell Shippable to provide your build with MongoDB service.
Then, provide mock connection URL to be used by your tests. On Shippable, MongoDB is accessed without providing user nor password.

.. code-block:: bash

  services:
     - mongodb

  env:
    global:
      - APP_NAME=rocky-wave-3011
      - MONGOLAB_URI=mongodb://localhost/test

Then proceed to configure your application as is outlined in per-language guides below.

Using MongoDB with PHP
^^^^^^^^^^^^^^^^^^^^^^

First, activate the official Mongo driver extension in ``php.ini`` on Shippable minion, as is explained in the documentation on PHP extensions:

.. code-block:: bash

  before_script: 
    - mkdir -p shippable/testresults
    - mkdir -p shippable/codecoverage
    - echo "extension=mongo.so" >> ~/.phpenv/versions/$(phpenv version-name)/etc/php.ini

Then, tell Heroku to enable the extension as well by providing the following ``composer.json`` file in the root of your repository:

.. code-block:: json

  {
    "require": {
      "ext-mongo": "*"
    }
  }

Finally, you can connect to the database with the code as follows: 

.. code-block:: php

  $mongoUrl = getenv("MONGOLAB_URI");
  $dbName = substr(parse_url($mongoUrl)["path"], 1);
  $this->mongo = new Mongo($mongoUrl);
  $this->scores = $this->mongo->{$dbName}->scores;

Please note that we need to parse the URL to the instance to extract the database name, as the Mongo driver expects that the database is selected by accessing property named
the same as the database, which is demonstrated in the last line of the snippet above.

Full sample of deploying PHP+MongoDB application to Heroku (using Heroku toolbelt) can be found on `our GitHub account <https://github.com/shippableSamples/sample-php-mongo-heroku>`_.

Using MongoDB with Python
^^^^^^^^^^^^^^^^^^^^^^^^^

First, create file called ``Procfile`` that will tell Heroku how to launch your Python application. For example, if you use Flask and create the application under name ``application``
in ``hello.py``

.. code-block:: bash

  web: gunicorn hello:application

Next, declare that your application depends on MongoDB official driver. Heroku requires ``requirements.txt`` file in the root of your repository that may be generated with ``pip freeze`` command.
For our (Flask) example, we will use file with contents as follows:

.. code-block:: bash

  nose
  coverage
  gunicorn
  Flask
  pymongo

Finally, you can connect to the database with the following code:

.. code-block:: python

  mongo_url = os.environ['MONGOLAB_URI']
  db_name = urlparse.urlparse(mongo_url).path[1:]
  client = MongoClient(mongo_url)
  self.db = client[db_name]

Please note that we need to parse the URL to the instance to extract the database name, as the Python Mongo driver follows the convention of accessing the database by property with
the same as the database, which is demonstrated in the last line of the snippet above.

Full sample of deploying Python+MongoDB application to Heroku (using Heroku toolbelt) can be found on `our GitHub account <https://github.com/shippableSamples/sample-python-mongo-heroku>`_.

Using MongoDB with Ruby
^^^^^^^^^^^^^^^^^^^^^^^

First, create a file called ``Procfile`` that will tell Heroku how to launch your application. For example, if you use Sinatra and your application entry point is located in file
called ``helloworld.rb``:

.. code-block:: bash

  web: bundle exec ruby helloworld.rb -p $PORT

Next, declare your dependencies in ``Gemfile``. For example, if using `Mongoid <http://mongoid.org/>`_ to access the database:

.. code-block:: bash

  source "https://rubygems.org"

  gem "rspec"
  gem "simplecov"
  gem "simplecov-csv"
  gem "rspec_junit_formatter"
  gem "sinatra"
  gem "mongoid"

To separate Mongoid configuration from your code, create YAML file (e.g. called ``mongoid.yml``):

.. code-block:: yaml

  production:
    sessions:
      default:
        uri: <%= ENV['MONGOLAB_URI'] %>

Next, use this file to connect to the database in your application:

.. code-block:: ruby

  require 'mongoid'
  Mongoid.load!('mongoid.yml', :production)

You can also execute Rake tasks in your ``after_success`` step using Heroku toolbelt. For example, to run database migrations at the end of the build:

.. code-block:: bash

  after_success:
    - test -f ~/.ssh/id_rsa.heroku || ssh-keygen -y -f ~/.ssh/id_rsa > ~/.ssh/id_rsa.heroku && heroku keys:add ~/.ssh/id_rsa.heroku
    - git remote -v | grep ^heroku || heroku git:remote --app $APP_NAME
    - git push -f heroku $BRANCH:master
    - heroku run rake db:migrate

Full sample of deploying Sinatra+MongoDB application to Heroku (using Heroku toolbelt) can be found on `our GitHub account <https://github.com/shippableSamples/sample-ruby-mongo-heroku>`_.

Using MongoDB with Node.js
^^^^^^^^^^^^^^^^^^^^^^^^^^

First, create file called ``Procfile`` that will tell Heroku how to launch your Node.js application. For example, if you use Express and define your routes in file called ``app.js``:

.. code-block:: bash

  web: node app.js

Next, declare that your application depends on Mongoose (or other library of your choice). Heroku will read your ``package.json`` file:

.. code-block:: json

  ...
  "dependencies": {
    "express": "~4.2.0",
    "mongoose": "^3.8.12",
    "when": "~3.2.3"
  },

Finally, you can connect to the database with the following code:

.. code-block:: javascript

  var mongoose = require('mongoose');
  mongoose.connect(process.env.MONGOLAB_URI);

Full sample of deploying Express+MongoDB application to Heroku (using Heroku toolbelt) can be found on `our GitHub account <https://github.com/shippableSamples/sample-nodejs-mongo-heroku>`_.

---------------------------

**Continuous deployment to Amazon Elastic Beanstalk**
--------------------------------------------------------

Amazon Elastic Beanstalk features predefined runtime environments for Java, Node.js, PHP, Python and Ruby, so it is possible to configure Shippable minions to automatically deploy applications targeting these environments. Moreover, Elastic Beanstalk also support defining custom runtime environments via Docker containers, giving the developer full flexibility in the configuration of technology stack. However, as the standard, pre-packaged environments are far easier to set up and cover nearly all languages currently supported by Shippable (except for Go), we will concentrate on how to integrate with Amazon Elastic Beanstalk using the former option.

To interact with Elastic Beanstalk, one needs to use command line tools supplied by Amazon, from which the most commonly used is ``eb`` command. These tools must be available to Shippable in order to perform deployment. The easiest way of doing so is to download them in ``before_install`` step:

.. code-block :: bash

  env:
    global:
      - EB_TOOLS_DIR=/tmp/eb_tools EB_VERSION=AWS-ElasticBeanstalk-CLI-2.6.3 EB_TOOLS=$EB_TOOLS_DIR/$EB_VERSION

  before_install:
    - if [ ! -e $EB_TOOLS ]; then wget -q -O /tmp/eb.zip https://s3.amazonaws.com/elasticbeanstalk/cli/$EB_VERSION.zip && mkdir -p $EB_TOOLS_DIR && unzip /tmp/eb.zip -d $EB_TOOLS_DIR; fi

You also need to obtain Access Key to connect ``eb`` tool with Elastic Beanstalk API. Please refer to `this documentation <http://docs.aws.amazon.com/general/latest/gr/getting-aws-sec-creds.html>`_ for details on obtaining the keys. It is recommended to save your access key as secret in Shippable, as is discussed in :ref:`secure_env_variables`. To use code from this tutorial, store the secret access key variable as ``AWSSecretKey``. It is safe to keep your access key id in plain text.

After having the basic setup done, it is time to create an application in Elastic Beanstalk. You can use Web GUI for this task, by going to the main page in the Elastic Beanstalk console, and then choosing 'Create a New Application' button in the sidebar. After entering name for application, proceed to define an environment. When you have the environment ready, create a file in your repository called ``config`` with your settings, where ``DevToolsEndpoint`` is based on the AWS region you are using:

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
      - EB_TOOLS_DIR=/tmp/eb_tools EB_VERSION=AWS-ElasticBeanstalk-CLI-2.6.3 EB_TOOLS=$EB_TOOLS_DIR/$EB_VERSION
      - RDS_HOSTNAME=127.0.0.1 RDS_USERNAME=shippable RDS_PASSWORD="" RDS_DB_NAME=test RDS_PORT=3306
      - secure: K7qw2XSFBaW+zEzrs0ODKMQq/Bo9AZqGotCXc50fao+et6WaxEmedlK//MO9JozmPdcxDRq5k8A0pmjTLsMLstkh7PUFLu3Z6xowU2OhMyjQ0pS2J8Hw16SgZ9n2EW+3cps4dIijEzOwjA0Yx5rTOC7F9N8nvr/1l4Yp4i11qgW08cefEKuwiF/ypgrkK5BYJyJreZOEJt3lJ6/aXyXxPPl3X3Z+L+ca9mQmTN6q1wnlEcYLDU5EJtkk87KtOfVyoi/+aOFh49eDpwStSD4zDnygia8eAnCGK/p0XGFJCAwWK1nnFY7aklJrvElD+V/2lbr14TwF0rhmiba6Y6ylnw==

Then, we need to add some steps to ``shippable.yml`` to update ``eb`` configuration and then launch it after successful build. We are invoking ``AWSDevTools-RepositorySetup.sh`` to configure git-based workflow for Elastic Beanstalk deployment (for instance, this command adds git remotes pointing to AWS endpoints).  Remember to replace value for ``AWSAccessKeyId`` with the one downloaded from your AWS Management Console:

.. code-block :: bash

  before_script: 
    - mkdir -p ~/.elasticbeanstalk
    - echo 'AWSAccessKeyId=AKIAJSZ63DT' >> ~/.elasticbeanstalk/aws_credential_file
    - echo 'AWSSecretKey='$AWSSecretKey >> ~/.elasticbeanstalk/aws_credential_file

  script:
    - mkdir -p .elasticbeanstalk
    - cp config .elasticbeanstalk/

  after_success :
    - $EB_TOOLS/AWSDevTools/Linux/AWSDevTools-RepositorySetup.sh
    - export PATH=$PATH:$EB_TOOLS/eb/linux/python2.7/ && virtualenv ve && source ve/bin/activate && pip install boto==2.14.0 && eb push

Finally, we can connect to the database using environment variables as defined above.

PHP
^^^

.. code-block :: php

  $con = mysqli_connect(
    $_SERVER['RDS_HOSTNAME'],
    $_SERVER['RDS_USERNAME'],
    $_SERVER['RDS_PASSWORD'],
    $_SERVER['RDS_DB_NAME'],
    $_SERVER['RDS_PORT']
  );            

Elastic Beanstalk serves your repository root as the document root of the webserver, so e.g. ``index.php`` file will be interpreted when you access the root context of your Elastic Beanstalk application. 
See full sample PHP code using Elastic Beanstalk available `on GitHub <https://github.com/shippableSamples/sample-php-mysql-beanstalk>`_.

Ruby
^^^^

.. code-block :: ruby

  con = Mysql2::Client.new(
    :host => ENV['RDS_HOSTNAME'],
    :username => ENV['RDS_USERNAME'],
    :password => ENV['RDS_PASSWORD'],
    :port => ENV['RDS_PORT'],
    :database => ENV['RDS_DB_NAME']
  )

Elastic Beanstalk runtime expects that the entry point of your application will be found in ``config.ru`` file. See `Amazon documentation <http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_Ruby_sinatra.html>`_ for details.
Full sample Ruby code using Sinatra and MySQL on Elastic Beanstalk is available `on GitHub <https://github.com/shippableSamples/sample-ruby-mysql-beanstalk>`_.

Python
^^^^^^

.. code-block :: python

  self.db = MySQLdb.connect(
    host = os.environ['RDS_HOSTNAME'],
    user = os.environ['RDS_USERNAME'],
    passwd = os.environ['RDS_PASSWORD'],
    port = int(os.environ['RDS_PORT']),
    db = os.environ['RDS_DB_NAME'])

As Python projects are already run in ``virtualenv`` on Shippable minions, change the ``after_success`` step from the end of the general description above to:

.. code-block :: python

  after_success:
    - $EB_TOOLS/AWSDevTools/Linux/AWSDevTools-RepositorySetup.sh
    - export PATH=$PATH:$EB_TOOLS/eb/linux/python2.7/ && pip install boto==2.14.0 && eb push

Elastic Beanstalk runtime expects that the entry point of your application will be found in ``application.py`` file. See `Amazon documentation <http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_Python_flask.html>`_ for details.
Full sample Python code using Flask and MySQL on Elastic Beanstalk is available `on GitHub <https://github.com/shippableSamples/sample-python-mysql-beanstalk>`_.

Node.js
^^^^^^^

.. code-block :: javascript

  var connection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME
  });

Elastic Beanstalk expects that the entry point of your application will be found in `app.js` or `server.js` file in the repository root. See `Amazon documentation <http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs_express.html>`_ for details.
Full sample Node.js code using Express and MySQL on Elastic Beanstalk is available `on GitHub <https://github.com/shippableSamples/sample-nodejs-mysql-beanstalk>`_.

Java
^^^^

For JVM, the connection setting are passed as system properties, rather than environment variables:

.. code-block :: java

  private final String dbName = System.getProperty("RDS_DB_NAME"); 
  private final String userName = System.getProperty("RDS_USERNAME"); 
  private final String password = System.getProperty("RDS_PASSWORD"); 
  private final String hostname = System.getProperty("RDS_HOSTNAME");
  private final int port = Integer.parseInt(System.getProperty("RDS_PORT"));
  private final String databaseUrl = "jdbc:mysql://" + hostname + ":" + port + "/" + dbName;

Because of this difference, dummy connection details for Shippable environment need to be passed as arguments during JVM invocation. Here is an example for Maven:

.. code-block :: bash

  script:
    - mkdir -p .elasticbeanstalk
    - cp config .elasticbeanstalk/
    - mvn clean cobertura:cobertura
    - mvn test -DRDS_PORT=3306 -DRDS_DB_NAME=test -DRDS_HOSTNAME=localhost -DRDS_PASSWORD= -DRDS_USERNAME=shippable

Finally, Elastic Beanstalk `expects exploded WAR <https://forums.aws.amazon.com/thread.jspa?messageID=329550>`_ in the root of the repository, so we need to copy and commit its contents as the final build step, prior to the deployment:

.. code-block :: bash

  after_success:
    - mvn compile war:exploded
    - cp -r target/App/* ./
    - git add -f META-INF WEB-INF
    - git commit -m "Deploy"
    - $EB_TOOLS/AWSDevTools/Linux/AWSDevTools-RepositorySetup.sh
    - export PATH=$PATH:$EB_TOOLS/eb/linux/python2.7/ && pip install boto==2.14.0 && eb push

See the full sample of Java web application featuring MySQL connection `on GitHub <https://github.com/shippableSamples/sample-java-mysql-beanstalk>`_ for details.

Scala
^^^^^

Scala deployment is very similar to the one described for Java above. First, RDS connection details need to be obtained from system properties, rather then environment variables.
Here is an example for `Slick <http://slick.typesafe.com/>`_:

.. code-block :: scala

  val dbName = System.getProperty("RDS_DB_NAME")
  val userName = System.getProperty("RDS_USERNAME")
  val password = System.getProperty("RDS_PASSWORD")
  val hostname = System.getProperty("RDS_HOSTNAME")
  val port = Integer.parseInt(System.getProperty("RDS_PORT"))
  val databaseUrl = s"jdbc:mysql://${hostname}:${port}/${dbName}"

  def connect = Database.forURL(
    url = databaseUrl, user = userName, password = password, driver = "com.mysql.jdbc.Driver")

Because of this difference, dummy connection details for Shippable environment need to be passed as arguments during JVM invocation. Here is an example for ``sbt``
(please note copying the coverage results, as `sbt-scoverage <https://github.com/scoverage/sbt-scoverage>`_ does not allow customizing the path via options):

.. code-block :: bash

  script:
    - mkdir -p .elasticbeanstalk
    - cp config .elasticbeanstalk/
    - sbt -DRDS_PORT=3306 -DRDS_DB_NAME=test -DRDS_HOSTNAME=localhost -DRDS_PASSWORD= -DRDS_USERNAME=shippable scoverage:test
    - cp target/scala-2.10/coverage-report/cobertura.xml shippable/codecoverage/coverage.xml

Finally, Elastic Beanstalk `expects exploded WAR <https://forums.aws.amazon.com/thread.jspa?messageID=329550>`_ in the root of the repository, so we need to copy and commit its contents as the final build step, prior to the deployment:

.. code-block :: bash

  after_success:
    - sbt package
    - unzip "target/scala-2.10/*.war" -d ./
    - git add -f META-INF WEB-INF
    - git commit -m "Deploy"
    - $EB_TOOLS/AWSDevTools/Linux/AWSDevTools-RepositorySetup.sh
    - export PATH=$PATH:$EB_TOOLS/eb/linux/python2.7/ && virtualenv ve && source ve/bin/activate && pip install boto==2.14.0 && eb push

See the full sample of Scalatra+Slick web application featuring MySQL connection `on GitHub <https://github.com/Shippable/sample-scala-mysql-beanstalk>`_ for details.

------------------

**Continuous deployment to AWS OpsWorks**
----------------------------------------------


AWS OpsWorks is a new PaaS offering from Amazon that targets advanced IT administrators and DevOps, providing them with more flexibility in defining runtime environments of their applications.
In OpsWorks, instances are arranged in so called layers, which in turn form stacks. Please refer to `the AWS documentation <http://docs.aws.amazon.com/opsworks/latest/userguide/gettingstarted.html>`_ for details.

OpsWorks allows provisioning instances with custom Chef recipes, which means unconstrained range of technologies that may be used on this platform.
Predefined Chef cookbooks are available for PHP, Ruby on Rails, Node.js and Java.

OpsWorks deployment process has slightly different nature than the one for Heroku or Amazon Elastic Beanstalk. While the former are 'push-based', meaning that the deployment is done by sending the build artifacts
to the platform, with OpsWorks you configure the service to pull the code and artifacts from a predefined resource.

This is done during definition of your application on OpsWorks, by entering URL for the repository.
Please note that for public access (without adding an SSH key), you need to use appropriate protocol for the endpoint, for example ``https://gihub.com/Shippable/sample-php-mysql-opsworks.git`` or ``git://gihub.com/Shippable/sample-php-mysql-opsworks.git``,
instead of SSH URL, such as ``github.com:Shippable/sample-php-mysql-opsworks.git``.

.. note::

  During our tests, some git commands (like ``ls-remote``) timed out for 'public' URLs on GitHub. This problem does not occur for SSH access, so you may need to create
  a SSH key for public repositories as well. To do so, execute ``ssh-keygen -f opsworks`` on your workstation and save the resulting files (``opsworks`` and ``opsworks.pub``)
  in a safe place. Then, add the contents of ``opsworks.pub`` to Deployment Keys in your GitHub repository settings. Next, paste the contents of ``opsworks`` file in SSH key
  box in Application definition in OpsWorks admin panel.

To integrate Shippable with OpsWorks, first define the stack, layers, instances and application as outlined in the AWS documentation.
We will use `AWS CLI tool <http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html>`_ to invoke deployments for your application.
In order for this to work, we need to provide the tools with your AWS access keys to authenticate with the AWS endpoint:

* Please refer to `this documentation <http://docs.aws.amazon.com/general/latest/gr/getting-aws-sec-creds.html>`_ for details on obtaining the keys. 
* Then, encrypt the secret key as discussed in :ref:`secure_env_variables`. Use ``AWS_SECRET_ACCESS_KEY`` as name for the secure variable (i.e. add ``AWS_SECRET_ACCESS_KEY=<your secret key here>`` in Shippable settings panel).
* Next, add the secret along with your key id as environment variables in ``shippable.yml`` (please note that name of the variable matters):

.. code-block :: bash

  env:
    global:
      - AWS_ACCESS_KEY_ID=AKIAJSZ63DTL3Z7KLVEQ
      - secure: KRaEGMHtRkYxCmWfvHIEkyfoA/+9EWHcoi1CIoIqXrvsF/ILmVVr0jC7X8u7FdfAiXTqn3jYGtLc5mgo5KXe/8zSLtygCr9U1SKJfwCgsw1INENlJiUraHCQqnnty0b3rsTfoetBnnY0yFIl2g+FUm3A57VnGXH/sTcpDZSqHfjCXivptWrSzE9s4W7+pu4vP+9xLh0sTC9IQNcqQ15L7evM2RPeNNv8dQ+DMdf48915M91rnPkxGjxfebAIbIx1SIhR1ur4rEk2pV4LOHo4ny3sasWyqvA49p1xItnGnpQMWGUAzkr24ggOiy3J5FnL8A9oIkf49RtfK1Z2F0EryA==

Finally, we can install and invoke AWS CLI tools to invoke deployment command in ``after_success`` step (application configuration settings were extracted to environment variables for readability):

.. code-block :: bash

  env:
    global:
      - AWS_DEFAULT_REGION=us-east-1 AWS_STACK=73f89cfc-3f99-4227-a339-73a0ba30acbb AWS_APP_ID=1604ff83-aeb4-4677-b436-a9daac1ceb98
      - AWS_ACCESS_KEY_ID=AKIAJSZ63DTL3Z7KLVEQ
      - secure: KRaEGMHtRkYxCmWfvHIEkyfoA/+9EWHcoi1CIoIqXrvsF/ILmVVr0jC7X8u7FdfAiXTqn3jYGtLc5mgo5KXe/8zSLtygCr9U1SKJfwCgsw1INENlJiUraHCQqnnty0b3rsTfoetBnnY0yFIl2g+FUm3A57VnGXH/sTcpDZSqHfjCXivptWrSzE9s4W7+pu4vP+9xLh0sTC9IQNcqQ15L7evM2RPeNNv8dQ+DMdf48915M91rnPkxGjxfebAIbIx1SIhR1ur4rEk2pV4LOHo4ny3sasWyqvA49p1xItnGnpQMWGUAzkr24ggOiy3J5FnL8A9oIkf49RtfK1Z2F0EryA==

  after_success:
    - virtualenv ve && source ve/bin/activate && pip install awscli
    - aws opsworks create-deployment --stack-id $AWS_STACK --app-id $AWS_APP_ID --command '{"Name":"deploy"}'

.. warning::

  Do not change AWS region from ``us-east-1`` even if your instances reside in a different region!
  This is a requirement of OpsWorks at the moment that all the requests are sent to this region, see `the documentation <http://docs.aws.amazon.com/opsworks/latest/userguide/cli-examples.html#cli-examples-create-deployment>`_.

.. note::

  ``AWS_STACK`` and ``AWS_APP_ID`` are not the names of your stack/application, but so called OpsWorks IDs. They can be accessed in stack/application settings page in the OpsWorks Management console.

Connecting to MySQL
^^^^^^^^^^^^^^^^^^^

OpsWorks provides predefined MySQL layer to add to your stack. Connection details for the database are stored in a generated file in the application root.
Type of the file being generated depends on the programming language you defined for your app. For example, for PHP it is ``opsworks.php`` scripts that exposes two classes: ``OpsWorksDb`` and ``OpsWorks``.
You can instantiate these classes to access connection details, as follows:

.. code-block :: php

  require_once("shared/config/opsworks.php");
  $opsWorks = new OpsWorks();
  $db = $opsWorks->db;
  $con = mysqli_connect($db->host, $db->username, $db->password, $db->database);

During tests on Shippable, we need to provide similar file to simulate production environment. For PHP, add the following file to your repository (e.g. under ``test-config/opsworks.php``):

.. code-block :: php

  <?php
  class OpsWorksDb {
    public $adapter, $database, $encoding, $host, $username, $password, $reconnect;

    public function __construct() {
      $this->adapter = 'mysql';
      $this->database = 'test';
      $this->encoding = 'utf8';
      $this->host = '127.0.0.1';
      $this->username = 'shippable';
      $this->password = '';
      $this->reconnect = 'true';
    }
  }

  // ...rest of the file omitted for brevity, you can access it at
  // https://github.com/shippableSamples/sample-php-mysql-opsworks/blob/master/test-config/opsworks.php

Then, in ``before_script`` step of your build, copy this file to the location required by your application code:

.. code-block :: bash

  before_script: 
    - cp test-config/opsworks.php .

See the full sample of PHP web application featuring MySQL connection `on GitHub <https://github.com/shippableSamples/sample-php-mysql-opsworks>`_ for details.

General information on using Amazon DynamoDB
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Amazon DynamoDB is a schema-less, fully managed NoSQL database service. It is not a part of OpsWorks offering, but rather a separate service that is accessed using SDK provided
by Amazon.

As DynamoDB is not available for download and is hosted only by Amazon, special care needs to be taken while setting up Shippable build. Connecting to the real DynamoDB from the
integration tests is not an option most of the times, mostly due to cost considerations and time it takes to create a new table in DynamoDB.

For this reason, mock databases were implemented, such as `Dynalite <https://github.com/mhart/dynalite>`_. Comprehensive list of the available mock databases is available on the
`AWS blog <http://aws.amazon.com/blogs/aws/amazon-dynamodb-libraries-mappers-and-mock-implementations-galore/>`_. During our tests it turned out that only the official mock
implementation provided by Amazon (`DynamoDB Local <http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.DynamoDBLocal.html>`_) worked flawlessly with PHP SDK
and this is the reason why it was included in the samples below. Your mileage may vary, especially as other mock databases catch up with the changes in the SDK.

We also need to inject AWS access key into the production environment, so our application can connect to the DynamoDB API endpoint. There are several ways of realizing this, 
all of which are documented extensively in the `AWS SDK guide <http://docs.aws.amazon.com/aws-sdk-php/guide/latest/credentials.html#credential-profiles>`_.
Here, we will take advantage of the fact that the access key is already available in the Shippable build (in encrypted form, see above) and generate the
configuration file during deployment.

To make the application under test connect to the mock database, we will override ``endpoint`` parameter passed to AWS SDK. Create a JSON file (called ``aws.json`` here)
with following contents:

.. code-block:: json

  {
    "includes": ["_aws"],
    "services": {
      "default_settings": {
        "params": {
          "key": "fake_key",
          "secret": "fake_secret",
          "region": "us-west-2",
          "base_url": "http://localhost:8000"
        }
      }
    }
  }

Supplying ``key``, ``secret`` and a valid region is mandatory, even though they will not be used in the test environment. For this reason, we enter some fake values
to make sure that the application will not be able to reach our production DynamoDB instance.

.. code-block:: bash

  env:
    global:
      - AWS_DEFAULT_REGION=us-east-1 AWS_STACK=73f89cfc-3f99-4227-a339-73a0ba30acbb AWS_APP_ID=1604ff83-aeb4-4677-b436-a9daac1ceb98
      - AWS_ACCESS_KEY_ID=AKIAJSZ63DTL3Z7KLVEQ AWS_REAL_REGION=us-west-2
      - DYNAMODB_LOCAL_DIR=/tmp/dynamodb-local
      - secure: KRaEGMHtRkYxCmWfvHIEkyfoA/+9EWHcoi1CIoIqXrvsF/ILmVVr0jC7X8u7FdfAiXTqn3jYGtLc5mgo5KXe/8zSLtygCr9U1SKJfwCgsw1INENlJiUraHCQqnnty0b3rsTfoetBnnY0yFIl2g+FUm3A57VnGXH/sTcpDZSqHfjCXivptWrSzE9s4W7+pu4vP+9xLh0sTC9IQNcqQ15L7evM2RPeNNv8dQ+DMdf48915M91rnPkxGjxfebAIbIx1SIhR1ur4rEk2pV4LOHo4ny3sasWyqvA49p1xItnGnpQMWGUAzkr24ggOiy3J5FnL8A9oIkf49RtfK1Z2F0EryA==

  before_install:
    - test -e $DYNAMODB_LOCAL_DIR || (mkdir -p $DYNAMODB_LOCAL_DIR && wget http://dynamodb-local.s3-website-us-west-2.amazonaws.com/dynamodb_local_latest -qO- | tar xz -C $DYNAMODB_LOCAL_DIR)

Then, in the ``before_install`` step, we download the latest version of DynamoDB Local and extract it to a temporary location. In ``script`` step we first kill any
outstanding instances of the database, then launch the mock database in the background, saving the process pid in a variable.
We use ``-inMemory`` option here so that the mock database will not save any data to disk. Next, the actual tests are run and we complete the step by shutting down
the database instance.

.. code-block:: bash

  script:
    - ps -ef | grep [D]ynamoDBLocal | awk '{print $2}' | xargs --no-run-if-empty kill
    - java -Djava.library.path=$DYNAMODB_LOCAL_DIR/DynamoDBLocal_lib -jar $DYNAMODB_LOCAL_DIR/DynamoDBLocal.jar -inMemory &
    - DYNAMODB_PID=$!
    # tests run here (language-specific)
    - kill $DYNAMODB_PID

.. note::

  ``grep`` invocation above creates a (somewhat extraneous) character class for the first letter of the search string. This is done to prevent ``grep`` from including itself
  in the results. It works because the ``grep`` process will have ``[D]ynamoDBLocal`` string in its command, which is not matched by ``[D]ynamodblocal`` (because of the square brackets).

Next, we need some way of injecting AWS secret key in the ``aws.json`` file on the target OpsWorks instance. This can be done by registering a Chef deployment hook that will overwrite
this file with values retrieved from Chef configuration. Hooks are registered by placing aptly named files in ``deploy`` directory in your repository root.
Please refer to `AWS documentation <http://docs.aws.amazon.com/opsworks/latest/userguide/workingcookbook-extend-hooks.html>`_
and `Opscode documentation on deploy resource <http://docs.opscode.com/resource_deploy.html#deploy-phases>`_ if you interested in details.

For your convenience, here (and in samples repositories) we provide a ``before_restart`` hook that will generate correct ``aws.json``.
Please note that we don't define ``endpoint`` here, so AWS will pick the correct one based on the region.
Place this file as ``deploy/before_restart.rb`` in your repository root:

.. code-block:: ruby

  require 'json'

  Chef::Log.info('Generating aws.json configuration file')

  aws_config = {
    :includes => ['_aws'],
    :services => {
      :default_settings => {
        :params => {
          :key => node[:dynamodb][:aws_key],
          :secret => node[:dynamodb][:aws_secret],
          :region => node[:dynamodb][:region]
        }
      }
    }
  }

  aws_file_path = ::File.join(release_path, 'aws.json')
  file aws_file_path do
    content aws_config.to_json
    owner new_resource.user
    group new_resource.group
    mode 00440
  end

The script above reads the required configuration variables from the Chef node attributes and saves them as JSON file in the format expected by AWS SDKs.

While launching deployment, we can override node attributes by passing `custom JSON <http://docs.aws.amazon.com/opsworks/latest/userguide/workingstacks-json.html>`_. We will take
advantage of this option to set node attributes that the hook above expects.
The special syntax with ``>`` sign is used here to prevent YAML parser from interpreting colons in the JSON definition.

.. code-block:: bash

  after_success:
    - >
      DEPLOY_JSON=$(printf '{"dynamodb": {"aws_key": "%s", "aws_secret": "%s", "region": "%s"}}' $AWS_ACCESS_KEY_ID $AWS_SECRET_ACCESS_KEY $AWS_REAL_REGION)
    - virtualenv ve && source ve/bin/activate && pip install awscli
    - aws opsworks create-deployment --stack-id $AWS_STACK --app-id $AWS_APP_ID --command '{"Name":"deploy"}' --custom-json "$DEPLOY_JSON"

Then proceed to configure your application as is outlined in per-language guides below.

Using DynamoDB with PHP
^^^^^^^^^^^^^^^^^^^^^^^^^

To access DynamoDB, you need some client library that is able to speak AWS API. We will use the official `AWS PHP SDK <http://aws.amazon.com/sdkforphp/>`_ in the sample below.
We will install the library using `Composer <https://getcomposer.org/>`_. Create ``composer.json`` in the root of your repository with the following contents:

.. code-block:: json

  {
    "require": {
      "aws/aws-sdk-php": "2.*"
    }
  }

Composer will be already available on Shippable minion. Install the dependencies during ``before_script`` step as follows:

.. code-block:: bash

  before_script: 
    - mkdir -p shippable/testresults
    - mkdir -p shippable/codecoverage
    - composer install

Then, we need to perform the same step on the target OpsWorks instance. Add the following deploy hook as ``deploy/before_symlink.rb``:

.. code-block:: ruby

  run "cd #{release_path} && ([ -f tmp/composer.phar ] || curl -sS https://getcomposer.org/installer | php -- --install-dir=tmp)"
  run "cd #{release_path} && php tmp/composer.phar --no-dev install"

We can then proceed to consume ``aws.json`` file we created in the previous section to instantiate AWS SDK client:

.. code-block:: php

  require('vendor/autoload.php');
  use Aws\Common\Aws;

  $aws = Aws::factory('aws.json');
  $client = $aws->get('DynamoDb');

This client can be then used to interact with DynamoDB, for example as follows:

.. code-block:: php

  $client->createTable(array(
    'TableName' => self::TABLE_NAME,
    'AttributeDefinitions' => array(
      array(
        'AttributeName' => 'id',
        'AttributeType' => 'N'
      )
    ),
    'KeySchema' => array(
      array(
        'AttributeName' => 'id',
        'KeyType' => 'HASH'
      )
    ),
    'ProvisionedThroughput' => array(
      'ReadCapacityUnits' => 1,
      'WriteCapacityUnits' => 1
    )
  ));

Refer to the `DynamoDB client documentation <http://docs.aws.amazon.com/aws-sdk-php/guide/latest/service-dynamodb.html>`_
and `the full sample <https://github.com/shippableSamples/sample-php-dynamo-opsworks>`_ on our GitHub account for details.

Using DynamoDB with Node.js
^^^^^^^^^^^^^^^^^^^^^^^^^^^

To access DynamoDB, you need some client library that is able to speak AWS API. We will use the official `AWS Node.js SDK <http://aws.amazon.com/sdkfornodejs/>`_ in the sample below.
We will install the library using ``npm`` (saving the dependency to ``package.json``):

.. code-block:: bash

  npm install --save aws-sdk

The packages will be then installed automatically (by invoking ``npm install``) both by Shippable and OpsWorks deployment recipe.

Configuration file (that we called ``aws.json``) has slightly different structure for Node.js SDK. For Shippable build environment it
will look as follows:

.. code-block:: json

  {
    "accessKeyId": "fake_key",
    "secretAccessKey": "fake_secret",
    "region": "us-west-2",
    "endpoint": "http://localhost:8000"
  }

We also need to slightly change the Chef deployment hook for the modified JSON structure:

.. code-block:: ruby

  require 'json'

  return unless node[:dynamodb]
  Chef::Log.info('Generating aws.json configuration file')

  aws_config = {
    :accessKeyId => node[:dynamodb][:aws_key],
    :secretAccessKey => node[:dynamodb][:aws_secret],
    :region => node[:dynamodb][:region]
  }

  aws_file_path = ::File.join(release_path, 'aws.json')
  file aws_file_path do
    content aws_config.to_json
    owner new_resource.user
    group new_resource.group
    mode 00440
  end

DynamoDB client can be then constructed with the following snippet:

.. code-block:: javascript

  var AWS = require('aws-sdk');
  AWS.config.loadFromPath('./aws.json');
  var db = new AWS.DynamoDB();

Next, the client can be used to interact with DynamoDB, for example as follows:

.. code-block:: javascript

  var params = {
    TableName: TABLE_NAME,
    Item: {
      id: {
        N: '1'
      },
      score: {
        N: String(score)
      }
    }
  };
  db.putItem(params, callback);

Refer to the `DynamoDB client documentation <http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html>`_
and `the full sample <https://github.com/shippableSamples/sample-nodejs-dynamo-opsworks>`_ on our GitHub account for details.

-----------------------

**Continuous deployment to Google App Engine**
-----------------------------------------------------

Google App Engine supports Python, PHP, Go and Java applications. Support for PHP is in preview, while for Go is marked as experimental. As runtime present on App Engine is a very specific one, with many Google-specific services and some blacklisted modules, it is recommended to use Google App Engine SDK both during the development and testing of your application.

Installation of the GAE SDK
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

SDKs for all the runtimes are available as ZIP downloads on `the Google App Engine page <https://developers.google.com/appengine/downloads>`_.
The SDK contains tools to interact with the GAE API: for instance, it allows deployment of the application. 
Moreover, it comes with Development Server that lets you test the application on your local machine (and on Shippable minion), simulating
the GAE environment. Stubs for the GAE services are also provided to make unit testing easier.

Download the SDK for your platform from the link above to begin working on the application.
To make the SDK available for your Shippable build (here, for a Python project), add the following ``before_install`` step:

.. code-block:: bash

  env:
    global:
      - GAE_DIR=/tmp/gae

  before_install:
    - >
      test -e $GAE_DIR || 
      (mkdir -p $GAE_DIR && 
       wget https://storage.googleapis.com/appengine-sdks/featured/google_appengine_1.9.6.zip -q -O /tmp/gae.zip &&
       unzip /tmp/gae.zip -d $GAE_DIR)

It will first test if the tools are already available and download & unzip them if there are not.

Using Datastore from Python
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Google App Engine offers a number of storage services. One of them is NDB Datastore that is instantly available to your application, once
you deploy it to the platform.
To interact with Datastore, you need to use libraries bundled with the SDK. Below is a simple example of code that stores and retrieves data from 
Datastore. More information can be found in `the GAE documentation <https://developers.google.com/appengine/docs/python/ndb/>`_:

.. code-block:: python

  from google.appengine.ext import ndb

  class Score(ndb.Model):
    score = ndb.IntegerProperty()
    timestamp = ndb.DateTimeProperty(auto_now_add=True)

  class Storage():
    def score_key(self):
      return ndb.Key('Score', 'Store')

    def populate(self):
      new_score = Score(parent=self.score_key())
      new_score.score = random.randint(1, 1234)
      new_score.put()

    def get_score(self):
      score_query = Score.query(ancestor=self.score_key()).order(-Score.timestamp)
      return score_query.get().score

No connection setup is required, as the GAE will handle providing the service to your application automatically.
Thanks to the existence of the Development Server, we can test this code both with a unit test and a integration test.

Unit test that stubs Datastore calls looks as follows:

.. code-block:: python

  import unittest
  from google.appengine.ext import db
  from google.appengine.ext import testbed
  from helloworld import Storage

  class HelloTestCase(unittest.TestCase):
    def setUp(self):
      self.testbed = testbed.Testbed()
      self.testbed.activate()
      self.testbed.init_datastore_v3_stub()

    def tearDown(self):
      self.testbed.deactivate()

    def test(self):
      storage = Storage()
      storage.populate()
      score = storage.get_score()
      self.assertLess(score, 1234)

  if __name__ == "__main__":
    unittest.main()

The only GAE-specific code is enclosed in ``setUp`` and ``tearDown`` methods and it initializes and then closes the stubbing framework.

We can also write an integration test, in which the code connects to a mock database included in the SDK:

.. code-block:: python

  from webtest import TestApp
  from helloworld import application

  app = TestApp(application)

  def test_index():
    response = app.get('/')
    assert 'Hello, World' in response

For the above to work, we need to use a dedicated test runner that will run the test in the Development Server environment.
For example, to use `NoseGAE <https://github.com/Trii/NoseGAE>`_,  we need to install the following modules (preferably listed in ``requirements.txt``
file):

.. code-block:: bash

  nose
  coverage
  NoseGAE
  WebTest

We then install them on Shippable minion, using the following ``install`` step:

.. code-block:: bash

  install:
    - pip install -r requirements.txt

Finally, we can launch the both tests by invoking the test runner with extra arguments during the ``script`` step:

.. code-block:: bash

  script:
    - >
      nosetests test.py func_test.py 
      --with-gae --without-sandbox --gae-lib-root=$GAE_DIR/google_appengine
      --with-xunit --xunit-file=shippable/testresults/test.xml
      --with-coverage --cover-xml --cover-xml-file=shippable/codecoverage/coverage.xml

Please note the second line of the command, where we turn on the GAE plugin and pass the path of the SDK installation on the minion.
The ``--without-sandbox`` option was required to have the tests working successfully. This NoseGAE option tries to simulate the GAE environment,
where some functions are prohibited. Apparently, it doesn't work correctly for Datastore services.

The other parameters are here to generate JUnit XML report in the location expected by Shippable, as well as the coverage report.

.. _gae_python_deployment:

Deployment of a Python application
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

After you create the application using the GAE Admin Console, you can deploy it using the ``appcfg`` tool from the SDK.
First, create ``app.yaml`` file, including your application name in the first line:

.. code-block:: bash

  application: sample-python-datastore
  version: 1
  runtime: python27
  api_version: 1
  threadsafe: 1

  handlers:
  - url: /.*
    script: helloworld.application

Then, we need to authenticate against the GAE API. We have two options here that are suitable for non-interactive build environment:
password-based authentication and OAuth2.

To setup password-based authentication, include two environment variables in your ``shippable.yml``:
``EMAIL`` (that stores the name of your Google account) and ``GAE_PASSWORD``.
It is recommended to store the password in encrypted form, using :ref:`secure_env_variables`:

.. code-block:: bash

  env:
    global:
      - GAE_DIR=/tmp/gae
      - EMAIL=shippable@gmail.com
      - secure: lffPR8giDdKinq1LfjTabgM8Lufb3sdweFWJcoU8o/KIvwTg9NOxEw3oG5pw4+pI0c3q/k0JkBv7QgDGkoiRHwZkebWYNcHwyo2NFaa/cpwpNjv3pMZsXpMiw+duSvfjA/XmFAynmW8/ft2YaAzpB1Mbn5p2k7ID2qCMv/YmFgIu605VK/WUnYPEdxMD2vkifVSNAIH42GOR+2ht4nKj85Wsu9OGgMBJ5XAqVcQoWX+Ui9yZvtaf3WKzowg+MC4PQ0qGLH/l6WHkY8bBCduMz65JjZIss2s972L4P8Hwpk+gDdVtRE82hKH7GuEYdNKhKjbthZmn5AF4thI72N5TjQ==

Next, you can invoke ``appcfg update`` command to deploy new version of your application with the following ``after_success`` step:

.. code-block:: bash

  after_success:
    - echo "$GAE_PASSWORD" | $GAE_DIR/google_appengine/appcfg.py -e "$EMAIL" --passin update .

.. note::

  If you use two-factor authentication for your Google account, you need to generate application-specific password for the GAE to use.
  Refer to `this documentation <https://support.google.com/accounts/answer/185833?hl=en>`_ for the details.

Alternatively, you can use OAuth2 protocol to authenticate against the GAE API. To set it up, first run this command in the repository root on your
local workstation:

.. code-block:: bash

  $PATH_TO_GAE_SDK/appcfg.py --oauth2 list_versions .

It will open a page in your browser where you can authorize the GAE to access your Google account.
As the result, ``.appcfg_oauth2_tokens`` file will be created in your home directory, containing the access token.
You can then encrypt it as Shippable secure variable and use in your ``after_success`` step as follows:

.. code-block:: bash

  after_success:
    - $GAE_DIR/google_appengine/appcfg.py --oauth2_access_token=$GAE_TOKEN update .

.. note::

  Recently, Google opened a preview of git-based deployment workflow, in which you push the code to a git repository, triggering the build.
  As this functionality is not yet in its final form, it is not discussed here. Please refer to
  `the GAE documentation <https://developers.google.com/cloud/devtools/repo/push-to-deploy>`_ to track its progress.

Full sample of Python+Datastore application can be found on `our Github account <https://github.com/shippableSamples/sample-python-datastore-appengine>`_.

Using Cloud SQL from Python
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Another storage service offered by Google App Engine is Cloud SQL. It is essentially a managed MySQL database and many applications that already
use MySQL (or other relational database) can be ported to Google App Engine with relatively small effort.
For this reason, the examples below will show how to adapt an existing Django application to use Cloud SQL.

No changes need to be done to the application code. The code that interacts with the database uses only standard Django ORM abstractions:

.. code-block:: python

  from django.db import models

  class Score(models.Model):
    score = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

  class Storage():
    def populate(self):
      new_score = Score()
      new_score.score = random.randint(1, 1234)
      new_score.save()

    def get_score(self):
      score_query = Score.objects.all().order_by('-timestamp')[:1]
      return score_query[0].score

Connection settings in ``settings.py`` are different for each environment.
Details of this configuration are explained in detail below:

.. code-block:: python

  APP_ENGINE = os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine')

  if APP_ENGINE:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'HOST': '/cloudsql/fifth-composite-657:test',
            'NAME': 'django_test',
            'USER': 'root',
        }
    }
  elif os.getenv('SETTINGS_MODE') == 'prod':
      # Running in development, but want to access the Google Cloud SQL instance
      # in production.
      DATABASES = {
          'default': {
              'ENGINE': 'google.appengine.ext.django.backends.rdbms',
              'INSTANCE': 'fifth-composite-657:test',
              'NAME': 'django_test',
              'USER': 'root',
          }
      }
  else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'test',
            'USER': 'shippable',
        }
    }

Here, the ``APP_ENGINE`` variable is used to determine whether the application is running on the App Engine.
See `GAE documentation <https://developers.google.com/appengine/docs/python/cloud-sql/django#development-settings>`_
for details. If so, we use standard MySQL Django engine to communicate with the database. The ``HOST`` variable
identifies the Cloud SQL instance. Its value should always have the ``/cloudsql/<application_id>:<instance_id>``
format.

The ``root`` user is configured by Cloud SQL, while the database needs to be created manually.
At the time of writing, (somewhat surprisingly) this was not possible from the new Google Cloud Developers Console.
To create a database, one needs to go to `old Google APIs console <https://code.google.com/apis/console>`_, choose
the correct project and then switch to "Google Cloud SQL" by clicking the link in the sidebar.  
On the right, the "SQL Prompt" tab should be visible that allows to execute DDL commands
(like ``create database django_test;``).

The second ``if`` branch in the configuration above is for connecting to your Cloud SQL instance via HTTP API.
This is particularly useful for executing management commands against the database, e.g. schema migrations.
The ``ENGINE`` here uses module provided by Google App Engine SDK for Python.
SDKs for all the runtimes are available as ZIP downloads on `the Google App Engine page <https://developers.google.com/appengine/downloads>`_.

Instead of ``HOST`` variable, ``INSTANCE`` is passed here directly. The other options are the same as for the
'production' configuration. Using this configuration, we can update schema on the Cloud SQL instance
(or initialize it just after database creation), with the following commands:

.. code-block:: bash

  export PYTHONPATH=$PYTHONPATH:$GAE_DIR/google_appengine/lib/django-1.5:$GAE_DIR/google_appengine
  SETTINGS_MODE='prod' python ./manage.py syncdb

Here, we assume that ``GAE_DIR`` is the location where you unpacked the Google App Engine SDK.
By setting ``SETTINGS_MODE`` environment variable we are triggering use of the second configuration.

The third configuration is only used for testing and development purposes and it uses database installed
locally. For simplicity, we use here ``test`` as database name and ``shippable`` as the user, so
the settings on the developer workstation will mirror the ones found on Shippable minion.
Of course, you can add another configuration section to keep settings for Shippable and development
environment separate. We create the database on the Shippable minion in the ``before_script`` step:

.. code-block:: yaml

  before_script: 
    - mkdir -p shippable/testresults
    - mkdir -p shippable/codecoverage
    - mysql -e 'create database test;'

Finally, we need to declare dependencies on the libraries that we will use for connecting to the
database and testing the storage-related classes. In the ``requirements.txt`` file, we add the 
following modules:

.. code-block:: bash

  coverage
  Django==1.5
  django-nose
  mock
  mock-django
  MySQL-python

Then, during the build, we install these dependencies in ``install`` step:

.. code-block:: yaml

  install:
    - pip install -r requirements.txt

Google App Engine uses different mechanism for dependency management.
To ensure any non-standard modules will be available to your application, you need
to add ``libraries`` section in the ``app.yaml`` file that is read by GAE deployment tools:

.. code-block:: yaml

  libraries:
  - name: django
    version: "1.5"
  - name: MySQLdb
    version: "latest"

See the section below on deploying Django applications for the details.

Again, unit tests for the application using Cloud SQL do not contain any GAE-specific code:

.. code-block:: python

  import unittest
  from mock import patch, Mock
  from mock_django.query import QuerySetMock
  from django_cloudsql.storage import Storage
  from models import Score

  class StorageTestCase(unittest.TestCase):
    @patch('django_cloudsql.storage.Score')
    def test(self, score_class_mock):
      save_mock = Mock(return_value=None)
      score_class_mock.return_value.save = save_mock

      storage = Storage()
      storage.populate()
      self.assertEqual(save_mock.call_count, 1)

      score = Score()
      score.score = 1234
      score_class_mock.objects.all.return_value.order_by.return_value = QuerySetMock(score_class_mock, score)
      score = storage.get_score()
      self.assertEqual(score, 1234)

  if __name__ == "__main__":
    unittest.main()

Running tests within the Django application context can be performed using ``django-nose`` test runner.
To prevent it from being loaded on the production environment, we can once again use the ``APP_ENGINE`` variable:

.. code-block:: python

  APP_ENGINE = os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine')

  # Application definition

  INSTALLED_APPS = (
      'django.contrib.admin',
      'django.contrib.auth',
      'django.contrib.contenttypes',
      'django.contrib.sessions',
      'django.contrib.messages',
      'django.contrib.staticfiles',
      'django_cloudsql',
  )

  # Add nose test runner if not on the production
  if not APP_ENGINE:
    INSTALLED_APPS = INSTALLED_APPS + ('django_nose',)

  TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'

  NOSE_ARGS = [
    '--with-xunit', '--xunit-file=shippable/testresults/test.xml',
    '--with-coverage', '--cover-xml', '--cover-xml-file=shippable/codecoverage/coverage.xml',
  ]

As all the paths needed to generate test and coverage reports consumed by Shippable are passed in the ``settings.py``, we
can then run the tests with the following ``script`` build step:

.. code-block:: bash

  script:
    - python manage.py test

See the sample of Django+Cloud SQL application on
`our GitHub account <https://github.com/shippableSamples/sample-django-cloudsql-appengine>`_ for the details.

Deployment of a Django application
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

After you create the application using the GAE Admin Console, you can deploy it using the ``appcfg`` tool from the SDK.
First, create ``app.yaml`` file, including your application name in the first line (please note the declaration of the
dependencies):

.. code-block:: bash

  application: fifth-composite-657
  version: 1
  runtime: python27
  api_version: 1
  threadsafe: 1

  libraries:
  - name: django
    version: "1.5"
  - name: MySQLdb
    version: "latest"

  builtins:
  - django_wsgi: on

Then, we need to authenticate against the GAE API.
Please refer to :ref:`gae_python_deployment` for details on different methods of authentication.
Full example of ``shippable.yml`` file, including download of the SDK and deployment of the
application in the ``after_success`` step would then look like follows:

.. code-block:: bash

  language: python 
  python:
    - 2.7

  env:
    global:
      - GAE_DIR=/tmp/gae
      - EMAIL=shippable@gmail.com
      - secure: lffPR8giDdKinq1LfjTabgM8Lufb3sdweFWJcoU8o/KIvwTg9NOxEw3oG5pw4+pI0c3q/k0JkBv7QgDGkoiRHwZkebWYNcHwyo2NFaa/cpwpNjv3pMZsXpMiw+duSvfjA/XmFAynmW8/ft2YaAzpB1Mbn5p2k7ID2qCMv/YmFgIu605VK/WUnYPEdxMD2vkifVSNAIH42GOR+2ht4nKj85Wsu9OGgMBJ5XAqVcQoWX+Ui9yZvtaf3WKzowg+MC4PQ0qGLH/l6WHkY8bBCduMz65JjZIss2s972L4P8Hwpk+gDdVtRE82hKH7GuEYdNKhKjbthZmn5AF4thI72N5TjQ==

  before_install:
    - >
      test -e $GAE_DIR || 
      (mkdir -p $GAE_DIR && 
       wget https://storage.googleapis.com/appengine-sdks/featured/google_appengine_1.9.6.zip -q -O /tmp/gae.zip &&
       unzip /tmp/gae.zip -d $GAE_DIR)

  install:
    - pip install -r requirements.txt

  before_script: 
    - mkdir -p shippable/testresults
    - mkdir -p shippable/codecoverage
    - mysql -e 'create database test;'

  script:
    - python manage.py test

  after_success:
    - echo "$GAE_PASSWORD" | $GAE_DIR/google_appengine/appcfg.py -e "$EMAIL" --passin update .

Full sample of Django+Cloud SQL application can be found on `our GitHub account <https://github.com/shippableSamples/sample-django-cloudsql-appengine>`_.

Using Datastore from Go
^^^^^^^^^^^^^^^^^^^^^^^

To interact with Datastore from Go, you need to use libraries bundled with the SDK. Below is a simple example of code that stores and retrieves data from 
Datastore. More information can be found in `the GAE documentation <https://developers.google.com/appengine/docs/go/datastore/>`_:

.. code-block:: go

  import (
    "math/rand"
    "time"

    "appengine"
    "appengine/datastore"
  )

  type Score struct {
    Score int
    Date  time.Time
  }

  func scoreKey(c appengine.Context) *datastore.Key {
    return datastore.NewKey(c, "Scores", "default_scoreboard", 0, nil)
  }

  func populate(c appengine.Context) error {
    score := Score{
      Score: rand.Intn(1234),
      Date:  time.Now(),
    }
    key := datastore.NewIncompleteKey(c, "Score", scoreKey(c))
    _, err := datastore.Put(c, key, &score)
    return err
  }

  func getScore(c appengine.Context) (int, error) {
    query := datastore.NewQuery("Score").Ancestor(scoreKey(c)).Order("-Date").Limit(1)
    for t := query.Run(c); ; {
      var score Score
      if _, err := t.Next(&score); err != nil {
        return -1, err
      }

      return score.Score, nil
    }
  }

No connection setup is required, as the GAE will handle providing the service to your application automatically.

Unit test that stubs Datastore calls using `aetest package <https://godoc.org/code.google.com/p/appengine-go/appengine/aetest>`_ looks as follows:

.. code-block:: go

  import (
    "testing"

    "appengine/aetest"
  )

  func TestStorage(t *testing.T) {
    c, err := aetest.NewContext(nil)
    if err != nil {
      t.Fatal(err)
    }
    defer c.Close()

    if err := populate(c); err != nil {
      t.Fatal(err)
    }

    score, err := getScore(c)
    if err != nil {
      t.Fatal(err)
    }
    if score < 0 || score > 1023 {
      t.Errorf("Score outside of expected range: %d", score)
    }
  }

.. note::

  Full integration testing of GAE Go applications with automatic mocking of the services is not yet available,
  but work on it is `being performed by Google team <https://groups.google.com/d/msg/google-appengine-go/9JZDLUMRkRE/B_UOS44UQjkJ>`_.

For the above to work, we need to run the tests via ``goapp`` command that is supplied as part of the GAE Go SDK.
Its installation and setup is described in the section below.

Deployment of a Go application
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Go packages are resolved relative to ``GOPATH`` variable that needs to be set both in your development environment and on Shippable minion.
`The common practice <http://code.google.com/p/go-wiki/wiki/GithubCodeLayout>`_ when structuring an application that is hosted on GitHub
is to name your packages according to the following pattern:

.. code-block:: bash

  github.com/<GitHub username>/<repository name>/<package name, probably nested>

For example, the package that houses the main HTTP handler in `our Go sample <https://github.com/shippableSamples/sample-go-datastore-appengine>`_
is called ``github.com/Shippable/sample-go-datastore-appengine/hello``. It follows that in your development environment the contents of
the sample repository would be stored in the ``$GOPATH/src/github.com/Shippable/sample-go-datastore-appengine`` path.

Adhering to this convention ensures that the testing tools (which are package-aware) will work correctly and that your package can be
consumed by other packages.

Google App Engine slightly diverges from this structure, expecting to find the main entry point for the application in the root of your
repository.
In other words, while ``goapp test`` command lives in a package-oriented world, ``goapp serve`` and ``goapp deploy`` are tied to the
current directory.
Hence, it is common to create a dispatcher in the root of the repository that then calls the individual packages:

.. code-block:: go

  package routes

  import (
    "net/http"

    "github.com/Shippable/sample-go-datastore-appengine/hello"
  )

  func init() {
    http.HandleFunc("/", hello.Handler)
  }

This way, we can test the individual packages, while ensuring that the application will deploy properly.
The following snippet from ``shippable.yml`` downloads the GAE Go SDK, installs the packages required for generation of test and
coverage reports and then links the repository to the correct place in Go workspace (root of which is identified by ``GOPATH``).
Of note are also the environment variables used to authenticate against the GAE API.
Please refer to :ref:`gae_python_deployment` for details on different methods of authentication.

.. code-block:: yaml

  env:
    global:
      - GAE_DIR=/tmp/go_appengine
      - EMAIL=shippable@gmail.com
      - secure: lffPR8giDdKinq1LfjTabgM8Lufb3sdweFWJcoU8o/KIvwTg9NOxEw3oG5pw4+pI0c3q/k0JkBv7QgDGkoiRHwZkebWYNcHwyo2NFaa/cpwpNjv3pMZsXpMiw+duSvfjA/XmFAynmW8/ft2YaAzpB1Mbn5p2k7ID2qCMv/YmFgIu605VK/WUnYPEdxMD2vkifVSNAIH42GOR+2ht4nKj85Wsu9OGgMBJ5XAqVcQoWX+Ui9yZvtaf3WKzowg+MC4PQ0qGLH/l6WHkY8bBCduMz65JjZIss2s972L4P8Hwpk+gDdVtRE82hKH7GuEYdNKhKjbthZmn5AF4thI72N5TjQ==

  before_install:
    - >
      test -e $GAE_DIR || 
      (mkdir -p $GAE_DIR && 
       wget https://storage.googleapis.com/appengine-sdks/featured/go_appengine_sdk_linux_amd64-1.9.6.zip -q -O /tmp/gae.zip &&
       unzip /tmp/gae.zip -d /tmp)
    - go get github.com/jstemmer/go-junit-report
    - go get github.com/t-yuki/gocover-cobertura
    - mkdir -p $GOPATH/src/github.com/Shippable
    - ln -sfn $PWD $GOPATH/src/github.com/Shippable/sample-go-datastore-appengine

Finally, we can launch the test by invoking the test runner with extra arguments during the ``script`` step:

.. code-block:: yaml

  script:
    - >
      $GAE_DIR/goapp test -v -coverprofile=shippable/codecoverage/coverage.out github.com/Shippable/sample-go-datastore-appengine/hello |
        $GOPATH/bin/go-junit-report > shippable/testresults/results.xml
    - $GOPATH/bin/gocover-cobertura < shippable/codecoverage/coverage.out > shippable/codecoverage/coverage.xml

Please note that we use ``goapp`` command from the GAE SDK instead of the standard ``go`` command.
This is required in order to be able to use ``aetest`` package.

Next, we need to create the application using the GAE console and create ``app.yml`` file with matching application name:

.. code-block:: yaml

  application: sample-go-datastore
  version: 1
  runtime: go
  api_version: go1

  handlers:
  - url: /.*
    script: _go_app

Finally, we can deploy the application to Google App Engine in ``after_success`` step:

.. code-block:: yaml

  after_success:
    - echo "$GAE_PASSWORD" | $GAE_DIR/appcfg.py -e "$EMAIL" --passin update .

-------------------

**Continuous deployment to Red Hat OpenShift**
-----------------------------------------------

Red Hat OpenShift supports wide variety of runtime environments (called 'cartridges' here).
With Java, it is possible to deploy both to JBoss EAP, JBoss AP / Wildfly, Tomcat and Vert.x.
Other supported technologies include PHP, Ruby, Node.js, Python, Perl.

As the availability of JBoss is quite unique amongst the PaaSes, we will cover deployment of a Java EE 6 application below.

Preferred build tool for Java applications deployed to OpenShift is Apache Maven.
OpenShift invokes Maven build goal (``package``) as the part of the deployment, so (contrary to some other platforms) it
is not necessary to upload the build artifacts from Shippable.

After creating the application in the OpenShift web administration panel (or using the ``rhc`` command-line tool), we are
supplied with git endpoint that should be used to push the code during the deployment. We then can declare it as 
Shippable environment variable and add the remote in ``before_install`` step (or skip if it already exists):

.. code-block:: yaml

  env:
    global:
      - OPENSHIFT_REPO=ssh://53c851465973ca84e5000597@javamysql-shippablesamples.rhcloud.com/~/git/javamysql.git

  before_install:
    - git remote -v | grep ^openshift || git remote add openshift $OPENSHIFT_REPO

You also need to give Shippable permissions to deploy to the repository. It can be easily done by copying your
deployment key from Shippable admin panel and adding it in the 'Public Keys' section of
`OpenShift administration panel <https://openshift.redhat.com/app/console/settings>`_.

After this, deployment is as simple, as pushing to the OpenShift repository in ``after_success`` step:

.. code-block:: yaml

  after_success:
    - git push -f openshift $BRANCH:master

.. note::

  Please see :ref:`heroku_other_branches` for explanation of why ``BRANCH`` variable is used above.

Testing with Arquillian
^^^^^^^^^^^^^^^^^^^^^^^

Suggested testing method for Java EE applications is to use Arquillian. As opposed to most testing frameworks that rely
on unit testing the code outside of the application container (mostly for speed reasons), Arquillian performs full-stack
testing using the actual server.

In order to use it on Shippable, we first need to download and extract the version of JBoss Application Server (or Wildfly)
that matches the version used by OpenShift:

.. code-block:: yaml

  env:
    global:
      - JBOSS_HOME=/tmp/jboss-as-7.1.0.Final
      - JBOSS_SERVER_LOCATION=http://download.jboss.org/jbossas/7.1/jboss-as-7.1.0.Final/jboss-as-7.1.0.Final.tar.gz
      - OPENSHIFT_REPO=ssh://53c851465973ca84e5000597@javamysql-shippablesamples.rhcloud.com/~/git/javamysql.git

  before_install:
    - if [ ! -e $JBOSS_HOME ]; then curl -s $JBOSS_SERVER_LOCATION | tar zx -C /tmp; fi
    - git remote -v | grep ^openshift || git remote add openshift $OPENSHIFT_REPO

Then, we need to modify ``pom.xml`` to tell the Maven plugins to put the test and coverage results in the directories
expected by Shippable:

.. code-block:: xml

  <plugins>
    <!-- other plugins omitted for brevity -->
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
        <reportsDirectory>shippable/testresults</reportsDirectory>
      </configuration>
      <dependencies>
        <dependency>
          <groupId>org.apache.maven.surefire</groupId>
          <artifactId>surefire-junit4</artifactId>
          <version>2.7.2</version>
        </dependency>
      </dependencies>
    </plugin>
  </plugins>

We also add ``arq-jbossas-managed`` Maven profile that executes the tests in JBoss container controlled by
Arquillian:

.. code-block:: xml

  <profiles>
    <profile>
      <!-- An optional Arquillian testing profile that executes tests 
        in your JBoss AS instance -->
      <!-- This profile will start a new JBoss AS instance, and execute 
        the test, shutting it down when done -->
      <!-- Run with: mvn clean test -Parq-jbossas-managed -->
      <id>arq-jbossas-managed</id>
      <dependencies>
        <dependency>
          <groupId>org.jboss.as</groupId>
          <artifactId>jboss-as-arquillian-container-managed</artifactId>
          <version>${jboss.version}</version>
          <scope>test</scope>
        </dependency>
      </dependencies>
    </profile>
  </profiles>

Finally, we can launch the tests in the ``script`` step
(please recall that we don't need to build the actual EAR file, as it is being automatically built by OpenShift
during the deployment):

.. code-block:: bash

  before_script: 
    - mkdir -p shippable/testresults
    - mkdir -p shippable/codecoverage

  script:
    - mvn clean cobertura:cobertura
    - mvn test -Parq-jbossas-managed

Please refer to the `application sample <https://github.com/shippableSamples/sample-java-mysql-openshift>`_ for an example Arquillian test
of a RESTful webservice.

Using MySQL
^^^^^^^^^^^

When initializing the application with ``rhc`` command-line tool or using any of the quickstart repositories provided by OpenShift, a
special ``.openshift`` directory gets created in the repository root. It can contain various hooks into the deployment process
and configuration files that will be copied into JBoss AS instance of the cartridge.

To connect to MySQL, we will use the datasource that is already defined in the ``.openshift/config/standalone.xml.as7``:

.. code-block:: xml

  <datasource jndi-name="java:jboss/datasources/MySQLDS" enabled="${mysql.enabled}" use-java-context="true" pool-name="MySQLDS" use-ccm="true">
    <connection-url>jdbc:mysql://${env.OPENSHIFT_MYSQL_DB_HOST}:${env.OPENSHIFT_MYSQL_DB_PORT}/${env.OPENSHIFT_APP_NAME}</connection-url>
    <driver>mysql</driver>
    <security>
      <user-name>${env.OPENSHIFT_MYSQL_DB_USERNAME}</user-name>
      <password>${env.OPENSHIFT_MYSQL_DB_PASSWORD}</password>
    </security>
    <validation>
      <check-valid-connection-sql>SELECT 1</check-valid-connection-sql>
      <background-validation>true</background-validation>
      <background-validation-millis>60000</background-validation-millis>
      <!--<validate-on-match>true</validate-on-match>-->
    </validation>
    <pool>
      <flush-strategy>IdleConnections</flush-strategy>
    </pool>
  </datasource>

  <drivers>
    <driver name="mysql" module="com.mysql.jdbc">
      <xa-datasource-class>com.mysql.jdbc.jdbc2.optional.MysqlXADataSource</xa-datasource-class>
    </driver>
  </drivers>

.. note::

  When defining your own datasource, please check that you use correct module name (``com.mysql.jdbc``) for
  the MySQL driver. Many examples on the Internet use ``com.mysql``, but the configuration file in ``modules``
  directory of OpenShift JBoss server uses this convention.

You don't need to include the driver in your deployment package, as it will be already provided by OpenShift.

Then, you need to use this datasource in your ``persistence.xml`` configuration file:

.. code-block:: xml

  <?xml version="1.0" encoding="UTF-8"?>
  <persistence version="2.0"
      xmlns="http://java.sun.com/xml/ns/persistence" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="
      http://java.sun.com/xml/ns/persistence
      http://java.sun.com/xml/ns/persistence/persistence_2_0.xsd">
    <persistence-unit name="primary">
      <jta-data-source>java:jboss/datasources/MySQLDS</jta-data-source>
      <properties>
        <!-- Properties for Hibernate -->
        <property name="hibernate.dialect" value="org.hibernate.dialect.MySQLDialect" />
        <property name="hibernate.hbm2ddl.auto" value="create-drop" />
        <property name="hibernate.show_sql" value="false" />
      </properties>
    </persistence-unit>
  </persistence>

If you would like to test with different datasource (for example, with in-memory H2 database), you can
override this configuration by providing different persistence configuration:

.. code-block:: xml

  <?xml version="1.0" encoding="UTF-8"?>
  <persistence version="2.0"
     xmlns="http://java.sun.com/xml/ns/persistence" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="
          http://java.sun.com/xml/ns/persistence
          http://java.sun.com/xml/ns/persistence/persistence_2_0.xsd">
     <persistence-unit name="primary">
        <jta-data-source>java:jboss/datasources/TestDS</jta-data-source>
        <properties>
           <!-- Properties for Hibernate -->
           <property name="hibernate.hbm2ddl.auto" value="create-drop" />
           <property name="hibernate.show_sql" value="false" />
        </properties>
     </persistence-unit>
  </persistence>

Then, include it in your Arquillian test archive as ``persistence.xml``:

.. code-block:: java

  return ShrinkWrap.create(WebArchive.class, "test.war")
    .addClasses(Score.class, ScoreRestService.class, JaxRsActivator.class, Resources.class)
    .addAsResource("META-INF/test-persistence.xml", "META-INF/persistence.xml")

We invite you to explore our JavaEE+MySQL sample for OpenShift on the
`Shippable GitHub account <https://github.com/shippableSamples/sample-java-mysql-openshift>`_.

