:title: Getting Started 
:description: Basic getting started section
:keywords: getting started, questions, documentation, shippable

.. _getstarted:

Getting Started
===============


**Step 1** : Sign Up
--------------------

To sign up with shippable, you should have either Github or Bitbucket account. Go to `Shippable.com <https://www.shippable.com>`_  and click on the 'Login' button on the top menu which will give you an option to sign in with either Github or Bitbucket credentials.

Click on the login button and choose the service provider that you would like to login with. After entering credentials, it will take you to the standard app authorization page and requests you to give access to Shippable.      

.. note::
    We realize that most people do not want to give write access to their repo. However, we need write permissions to add deploy keys to your repos so that webhooks work. We do not touch anything else in the repo.

After authorization, you will be authenticated by the service provider and redirected back to Shippable. You are now ready to set up CI! 

Shippable allows you to connect both github and bitbucket service providers. To link both accounts, go to the dashboard page and click on the Bitbucket or Github icon on the top right that you would like to connect.

-------

**Step 2** : Enable CI for repos
---------------------------------------

Follow the steps below to enable a project:


1. Select your source code hosted account from the right side of dashboard page and it will redirect you to the respective account's dashboard page. 

2. Click on the **Repos** button and choose the project that you would like to build and then click on the **Enable** button.

-------

**Step 3** : Create YML file
----------------------------

Our CI environment needs a little information about your project to run the right build steps. We look for a file called ``shippable.yml`` in the root folder of your repo for this info. 

.. note::
  This example is for a node.js project. For other languages, refer to our :ref:`language guides <langrefs>`. 

  **If you use TravisCI, we support** ``.travis.yml`` **natively, so that you can test your repos in parallel with Shippable and compare the speed and rich visualizations.**

* Tell us what build image to use. This is an optional setting and if omitted, ``shippable/minv2`` is used as a default (syntax is ``<docker_hub_username>/<image_name>``).
    .. code-block:: python
        
        # build image from Docker Hub (see https://registry.hub.docker.com/repos/shippableimages/)
        build_image: shippableimages/ubuntu1404_nodejs

* Set the appropriate language and the version number. You can test against multiple versions for a single push by adding more entries. We support all versions of Node.js as it is auto installed during your first run.
    .. code-block:: python
        
        # language setting
        language: node_js

        # version numbers, testing against two versions of node
        node_js:
          - 0.10.25

- ``before_install`` tag can be used to install any additional libraries if needed. We use ``npm`` to run all dependencies in ``package.json``
    .. code-block:: python
        
        # npm install runs by default but shown here for illustrative purposes
        before_install: 
         - npm install docco
         - npm install coffee-script

- ``script`` tag can be used to install any additional libraries if needed. We use ``npm`` to run all dependencies in ``package.json``
    .. code-block:: python
        
        # Running npm test to run your test cases
        script: 
         - npm test

**Complete documentation of YML is available** :ref:`HERE <setup>`.

--------

**Step 4** : Test Visualizations
--------------------------------

To use Shippable's test visualization feature, your code coverage output needs to be in cobertura xml format and test results should be in junit format. More details can be found in our :ref:`Code Samples <samplesref>`. 


--------

**Step 5** : Run the build
---------------------------

Builds can be triggered through webhooks or manually through Shippable.com. 

**Webhooks**

Webhooks are user-defined HTTP callbacks. They are usually triggered by some event, such as pushing code to a repository or creating a pull request. Your builds will run automatically when webhooks are triggered. 

**Manual Builds** 

After enabling the project, click on the **Build this project** button to manually run the build. Instantly,it will redirect you to the build's page and the console log from your build minion starts to stream to your browser through sockets. 


--------

**Step 6** : Check output
------------------------- 
 
In addition to running builds, Shippable also provides visualization of key information for every build. 

The following information is available for every build -

**Console Log** :
Stdout of a build run is streamed to the browser in real-time using websockets. In addition, there are other important pieces of information like 

* build status
* duration
* github changeset id
* committer info

**Artifact archive** :
Add **archive: true** tag to your shippable.yml file to enable the download artifacts option. Build artifacts are automatically archived for each run after the completion. Go to build's page and then click on the **Artifacts** button to download the artifacts as a .tar file. All files in ./shippable folder at the root of the project are automatically archived. Make sure you include the **archive: true** tag in your yml file to enable the download archive button.

**Test cases** :
Test run output is streamed real-time to the console log when the tests are executed. If you want Shippable's parser to parse test output and provide a graphical representation, you need to export a JUNIT xml of your test output to the ./shippable/testresults folder. After the build completes, our build engine will automatically parse it and results appear on the Tests tab (available in build's page).

**Code Coverage** :
Executing tests but not really knowing what percentage of your code is actually being tested is like "Flying a plane without GPS". A variety of coverage tools like opencover, cobertura etc. provide a way to measure coverage of your tests. You can export the output of these tools to ./shippable/codecoverage and our build engine will automatically parse it and the results will appear on the Coverage tab.


Clicking on the **View build history** button will take you to the project's page where you can find all the builds.






 
