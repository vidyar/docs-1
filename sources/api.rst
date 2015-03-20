:title: Shippable API
:description: How to interface with Shippable's API
:keywords: shippable, API, HTTP


.. _api: 

.. note::

  You must be on the Startup or Custom plan to use our API 

API
===========================

**Overview and Purpose**
---------------------------

The Shippable API enables you to do anything that you would normally 
do in the Shippable UI through HTTP requests. Our +API is RESTful, and 
can be interfaced through curl, third party tools, your own wrapper libraries, 
or any form of HTTPS communication.

Endpoint
^^^^^^^^^^^^^^^^^^^^^^^^^^
The main endpoint for interacting with our API is https://api.shippable.com

Authentication
^^^^^^^^^^^^^^^^^^^^^^^^^^
Using our API requires authenticating with one of your Shippable API
tokens. Shippable API tokens can be generated from your account settings
page.

These tokens must be placed in the header of your HTTP request.
For example, if your API token has the value 10010, you would authenticate
this way with curl:

.. code-block:: bash

  curl -H "Authorization: apiToken 10010" https://api.shippable.com

A useful pattern is to set an env var with the value of your token.
For example, if we saved our token to the environment variable apiToken:

.. code-block:: bash

  curl -H "Authorization: apiToken $apiToken" https://api.shippable.com

This is useful not only because one no longer has to type type apiToken in
repeated times, but use of an env var allows for secure automatization of API 
scripts; it is dangerous to directly save your apiToken into code.

.. note::
 NEVER commit code containing your API token to a public repository. Doing
 so will compromise the security of your Shippable account. Treat your
 API token like a password

**Routes**
-----------------------------

/projects
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
The /projects endpoint will provide you with information about your projects, 
such as the projects on your Github or Bit Bucket account, and allow you to
retrieve information about them.

**GET /projects**

Will a return a list projects, and some info about the projects

Response

.. code-block:: javascript

  [
    {
      "mostRecentBuild": {
        "createdDate": "2015-02-22T02:52:00.526Z",
        "buildGroupNumber": 1,
        "id": "54e9444fac096311007dccd7",
        "status": 80,
        "durationCumulative": "29930",
        "commitSha": "39d50403945fb5a1d591b5ee2a549806ad80819a",
        "branch": "master"
      },
      "id": "54e80f5d91426fd6a78f6280",
      "language": "ruby",
      "autoBuild": true,
      "fullName": "user/example1",
      "name": "example1",
      "repositoryProvider": "github",
      "branches": [
        "master"
      ],
      "sourceDefaultBranch": "master"
    },
    {
      "mostRecentBuild": null,
      "branches": [],
      "repositoryProvider": "github",
      "name": "example2",
      "fullName": "user/example2",
      "autoBuild": false,
      "id": "54e3c35391426fd6a78cfd41"
    }
  ]
  
===================  =======      ==========================================================================
Name                 Type         Description
===================  =======      ==========================================================================
mostRecentBuild      object       An object of information about your most recent build, if available
id                   string       This project's unique id
language             string       The langauge of the project, as specified by the repo provider
autoBuild            boolean      States if the project will be auto built on pushes to the containing repo
fullName             string       The full name of the project, such as org/projectname
name                 string       A more succinct version of the fullName
repositoryProvider   string       The source providing the repo, such as Github or BitBucket
branches             list         A list of branches available to build from the repo
===================  =======      ==========================================================================

**GET /projects/:projectId**

Will return more in-depth information about the specified project.

Response

.. code-block:: javascript

  {
    "id": "54af3b7ld46123jfacaef00c",
    "branches": [
      "master",
      "feature1",
      "test"
    ],
    "autoBuild": true,
    "deployKey": {
      "public": "ssh-rsa SECRETE Shippable\n"
    },
    "settings": {
      "imageOptions": {
        "mounts": [],
        "ports": []
      },
      "environmentVariables": []
    },
    "created": "2015-01-09T02:23:49.586Z",
    "isEnabled": true,
    "enabledDate": "2015-02-09T06:40:25.463Z",
    "name": "project",
    "sourcePushed": "2015-03-17T15:22:00.000Z",
    "sourceCreated": "2015-01-06T05:05:22.000Z",
    "sourceUpdated": "2015-03-11T15:33:38.000Z",
    "language": "ruby",
    "updatedDate": "2015-03-18T23:29:19.334Z",
    "subscriptionId": "54af3b77d46935d5fbc1e00d",
    "sourceId": "28847632",
    "repositoryProvider": "github",
    "sourceRepoOwner": {
      "login": "owner",
      "starred_url": "https://api.github.com/users/owner/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/owner/subscriptions",
      "organizations_url": "https://api.github.com/users/owner/orgs",
      "repos_url": "https://api.github.com/users/owner/repos",
      "events_url": "https://api.github.com/users/owner/events{/privacy}",
      "received_events_url": null,
      "type": "User",
      "site_admin": false,
      "gists_url": "https://api.github.com/users/owner/gists{/gist_id}",
      "following_url": "https://api.github.com/users/owner/following{/other_user}",
      "followers_url": "https://api.github.com/users/owner/followers",
      "html_url": "https://github.com/owner",
      "url": "https://api.github.com/users/owner",
      "gravatar_id": "",
      "avatar_url": "https://avatars.githubusercontent.com/u/184391?v=3",
      "id": 184391
    },
    "isFork": false,
    "isPrivateRepository": true,
    "sourceDefaultBranch": "master",
    "repositorySshUrl": "git@github.com:owner/project.git",
    "repositoryUrl": "https://api.github.com/repos/owner/project",
    "sourceDescription": "",
    "fullName": "owner/project"
  }


=====================================  ========      ==========================================================================
Name                                   Type           Description
=====================================  ========      ==========================================================================
id                                     string         This project's unique id
branches                               list           A list of branches available to build from the repo
autoBuild                              boolean        States if the project will be auto built on pushes to the containing repo
deployKey                              string         The ssh key used by shippable for deployments
settings                               object         Settings info for project, such as images and environment variables 
created                                string         When the project was created
isEnabled
enabledDate                                           The date the project was enabled on shippable for auto builds
name                                   string         A more succinct version of the fullName
sourcePushed
sourceCreated
sourceUpdated
language                               string         The langauge of the project, as specified by the repo provider
updatedDate                            string
subscriptionId                         string         The subscription id connected to this account
sourceId
repositoryProvider                     string         The source providing the repo, such as Github or BitBucket
sourceRepoOwner                        string         The owner/org that holds this repo
isFork                                 boolean
isPrivateRepository                    boolean        Specifies if the project is private or public
sourceDefaultBranch                    string         Specifies the default branch for the projec
repositorySshUrl                       string         The ssh url for the repo
repositoryUrl                          string         The web url for the project
sourceDescription
fullName                               string         The full name of the project, such as org/projectname
=====================================  ========      ==========================================================================


**PUT /projects/:projectId/settings**

HOLD OFF

**GET /projects/:projectId/runningBuilds**

Returns a list of objects, where each object is a projection
of a build that is currently. The projection is similiar to
/builds/:buildid

**GET /projects/:projectId/runningBuilds/:number**

Returns the specified number of running builds.

**GET /projects/:projectId/queuedBuilds**

Returns a list of builds queued for this project. The
projection is similiar to /builds/:buildid


**GET /projects/:projectId/queuedBuilds/:number**

Returns the specified number of queued builds.

**GET /projects/:projectId/recentBuilds**

Returns a list of recent builds for the project. The 
projection is similiar to /builds/:buildid

**GET /projects/:projectId/recentBuilds/:number**

Returns the specified number of recent builds


/workflow
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
While /projects/* is used for retrieving info, /workflow/* is for initiating 
multi step processes, such as triggering or enabling a build, typically 
using your projectId as an input parameter.

**POST /workflow/enableRepoBuild**
This route is used for enabling your projects. It expects a JSON encoded
ProjectId.

Example Usage

.. code-block:: bash

  curl -H "Authorization: apiToken $apiToken" \ 
       -H "Content-Type: application/json" \
       -d "{\"projectId\": \"011d01\"}"
       https://api.shippable.com/workflow/enableRepoBuild

Query Parameters

========= ======== ===================
Name      Type     Description
========= ======== ===================
projectId string   Project's unique ID
========= ======== ===================


**POST /workflow/disableBuild**
Disable a repo from autobuilding

Query Parameters

========= ======== ===================
Name      Type     Description
========= ======== ===================
projectId string   Project's unique ID
========= ======== ===================

**POST /workflow/cancelBuild**

Cancels a build currently in progress

Query Parameters

========= ======== ===================
Name      Type     Description
========= ======== ===================
BuildId   string   Build's unique ID
========= ======== ===================


**POST /workflow/triggerBuild**

This route is used for starting builds of an enabled project

Query Parameters

========= ======== ===================
Name      Type     Description
========= ======== ===================
projectId string   Project's unique ID
========= ======== ===================

Response

.. code-block:: javascript

  {"BuildId": "aefjek3434j"}


===================  =======      ==========================================================================
Name                 Type         Description
===================  =======      ==========================================================================
BuildId              string       A build's unique Id
===================  =======      ==========================================================================



**POST /workflow/validateDockerHubCredentials**

Verifies a DockerHub account for the authenticated user

Query Parameters

========= ======== ====================
Name      Type     Description
========= ======== ====================
username   string   DockerHub username
password   string   DockerHub password
email      string   Dockerhub email
========= ======== ====================

/builds
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
The builds endpoint allows you to get information from your
builds
**/builds/:buildId**
Returns information about the specified build

Response

.. code-block:: javascript

  {
    "id": "54fa3333fl2jc30e001216f6",
    "isSkipCI": false,
    "isAutoCommit": false,
    "isAutoPush": false,
    "isAutoBuild": true,
    "isReRun": false,
    "isPullRequest": false,
    "isCompleted": true,
    "emailNotifications": [],
    "pullRequestNumber": null,
    "committer": {
      "avatarUrl": "https://avatars.githubusercontent.com/u/3ljl2kf?v=3",
      "displayName": "User",
      "login": "user",
      "email": "user@somethin.com"
    },
    "lastAuthor": {
      "avatarUrl": "",
      "displayName": "",
      "login": "",
      "email": ""
    },
    "triggeredBy": {
      "avatarUrl": "",
      "email": "user@website.com",
      "displayName": "User",
      "login": "User"
    },
    "requiresDedicatedHost": false,
    "buildItemStepOrder": [],
    "builds": [
      {
        "id": "54lkjlj32fc6dc0e00c63d92",
        "size": null,
        "isCompleted": true,
        "isBuildCompleted": false,
        "canCommit": false,
        "matrixValues": [
          {
            "id": "54fa3klljlk23f3e00c63d94",
            "value": "1.4",
            "name": "runtime"
          },
          {
            "id": "54fa3b9lk2k3ff0e00c63d93",
            "value": "",
            "name": "env"
          }
        ],
        "queuedDate": "2015-03-06T23:43:17.399Z",
        "isSubscriptionHost": false,
        "deprovisionStatusDate": "1970-01-01T00:00:00.000Z",
        "imageCommitStatusDate": "1970-01-01T00:00:00.000Z",
        "isFailureAllowed": false,
        "totalTests": 0,
        "testsFailed": 0,
        "testsPassed": 0,
        "testsSkipped": 0,
        "steps": {
          "commit": {
            "startTime": null,
            "duration": null,
            "endTime": null,
            "report": []
          },
          "upload": {
            "startTime": null,
            "duration": null,
            "endTime": null,
            "report": []
          },
          "purge": {
            "report": [
              {
                "status": 20,
                "time": "2015-03-06T23:42:20.503Z"
              },
              {
                "status": 30,
                "time": "2015-03-06T23:42:36.421Z"
              }
            ],
            "duration": 15918,
            "startTime": "2015-03-06T23:42:20.503Z",
            "endTime": "2015-03-06T23:42:36.421Z"
          },
          "push": {
            "report": [
              {
                "status": 40,
                "time": "2015-03-06T23:42:20.207Z"
              }
            ]
          },
          "cache": {
            "report": [
              {
                "status": 20,
                "time": "2015-03-06T23:42:19.942Z"
              },
              {
                "status": 30,
                "time": "2015-03-06T23:42:20.072Z"
              }
            ],
            "duration": 130,
            "startTime": "2015-03-06T23:42:19.942Z",
            "endTime": "2015-03-06T23:42:20.072Z"
          },
          "report": {
            "report": [
              {
                "status": 20,
                "time": "2015-03-06T23:44:58.506Z"
              },
              {
                "status": 30,
                "time": "2015-03-06T23:44:59.993Z"
              }
            ],
            "duration": 1487,
            "startTime": "2015-03-06T23:44:58.506Z",
            "endTime": "2015-03-06T23:44:59.993Z"
          },
          "boot": {
            "report": [
              {
                "status": 20,
                "time": "2015-03-06T23:40:42.322Z"
              },
              {
                "status": 30,
                "time": "2015-03-06T23:40:57.955Z"
              }
            ],
            "duration": 15633,
            "startTime": "2015-03-06T23:40:42.322Z",
            "endTime": "2015-03-06T23:40:57.955Z"
          },
          "dequeue": {
            "report": [
              {
                "status": 20,
                "time": "2015-03-06T23:40:36.992Z"
              },
              {
                "status": 30,
                "time": "2015-03-06T23:40:37.321Z"
              }
            ],
            "duration": 329,
            "startTime": "2015-03-06T23:40:36.992Z",
            "endTime": "2015-03-06T23:40:37.321Z"
          },
          "pull": {
            "startTime": "2015-03-06T23:40:37.680Z",
            "duration": 4307,
            "endTime": "2015-03-06T23:40:41.987Z",
            "report": [
              {
                "status": 20,
                "time": "2015-03-06T23:40:37.680Z"
              },
              {
                "status": 30,
                "time": "2015-03-06T23:40:41.987Z"
              }
            ]
          },
          "build": {
            "startTime": "2015-03-06T23:40:58.419Z",
            "duration": 79064,
            "endTime": "2015-03-06T23:42:17.483Z",
            "report": [
              {
                "status": 20,
                "time": "2015-03-06T23:40:58.419Z"
              },
              {
                "status": 80,
                "time": "2015-03-06T23:42:17.483Z"
              }
            ]
          }
        },
        "environment": "",
        "gemfile": null,
        "jdk": null,
        "version": "1.4",
        "status": 80,
        "buildNumber": 1,
        "commitTag": "test.2.1",
        "startDate": "2015-03-06T23:43:17.475Z",
        "hostId": "54f7892a6933cb0d00725682",
        "consoleLogBytes": 13142,
        "consoleLogLineCount": 334,
        "endDate": "2015-03-06T23:45:17.249Z",
        "duration": 119774,
        "branchCoveragePercent": 0,
        "sequenceCoveragePercent": 0
      }
    ],
    "createdDate": "2015-03-06T23:43:17.399Z",
    "updatedDate": "2015-03-06T23:43:17.399Z",
    "repositorySize": 22358146,
    "repositoryFileCount": 626,
    "shouldArchive": false,
    "privileged": false,
    "imageName": "shippable/minv2",
    "imageId": "540ef25d5e5bad45f3fa6cb7",
    "settings": {
      "imageOptions": {
        "networkMode": "bridge",
        "privileged": false
      },
      "imageId": "540ef25d5e5bad45f3fa6cb7",
      "runCommand": "",
      "imageName": "shippable/minv2"
    },
    "language": "go",
    "compareUrl": "https://github.com/user/project/compare/2llkf2f2ff2f0000000000000000000000000000...e30e7a6606edd337a176f00a8b48bfc023ae2a81",
    "beforeCommitSha": "0000000000000000000000000000000000000000",
    "branch": "test",
    "branchHead": "test",
    "status": 80,
    "buildGroupNumber": 2,
    "projectId": "54fa22455ab6cc1352945c95",
    "lastCommitShortDescription": "stuff",
    "commitSha": "e30e7a6606edd337a176f3ljflsjflsjflae2a81",
    "commitUrl": "https://github.com/stuff.git",
    "createdByAccountId": "540e749ljljljl23f3f16dd0",
    "baseCommitRef": "",
    "runCommand": "",
    "emailOnSuccess": "change",
    "emailOnFailure": "always",
    "timeoutMS": 5400000,
    "buildRunnerVersion": "1.0.0",
    "statusMessage": "FAILED",
    "durationCumulative": "119774",
    "shouldDecryptSecureEnvs": true,
    "branchCoveragePercent": 0,
    "sequenceCoveragePercent": 0,
    "testsSkipped": 0,
    "testsPassed": 0,
    "testsFailed": 0,
    "totalTests": 0,
    "parallelizedTest": false,
    "network": "bridge"
  }


**/builds/:buildId**
Contains information about the individual builds inside the matrix, along
with associated metadata

Reponse
TODO Currently the API isn't successfully returning this route


**/builds/:buildId/:buildItemNumber/ext**
Gets build extensions such as your shippable.yml file

**/builds/:buildId/:buildNumber/artifacts**
Provides a link to your build artifacts
#TODO not really, but that's what I think it should do, as our api
only returns JSON.
