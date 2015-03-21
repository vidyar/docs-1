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

Coming soon!

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

Coming soon!

**/builds/:buildId**
Contains information about the individual builds inside the matrix, along
with associated metadata

Reponse
Coming soon!


**/builds/:buildId/:buildItemNumber/ext**
Gets build extensions such as your shippable.yml file

Coming soon!

/accounts
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

**GET /accounts**

Returns a string list of your account ids

Response

.. code-block:: javascript
  
  ["322fasf323f3gw3"]


**GET /accounts/:accountId**

.. code-block:: javascript

  {
    "id": "640e74943999391400416qr0",
    "lastUsedIdentityId": "640e74943999391400416qr1",
    "identities": [
      {
        "id": "640e74943999391400416qr1",
        "scopes": [
          "read:org",
          "repo",
          "user:email",
          "write:repo_hook"
        ],
        "enforceScopes": [
          "read:org",
          "repo",
          "user:email",
          "write:repo_hook"
        ],
        "emails": [
          {
            "primary": true,
            "verified": true,
            "email": "user@gmail.com"
          }
        ],
        "migratedProviderId": true,
        "providerOwnedPrivateRepos": null,
        "providerType": "User",
        "providerId": "2054256",
        "provider": "github",
        "avatarId": "",
        "avatarUrl": "https://avatars.githubusercontent.com/u/RRR4256?v=3",
        "displayName": "A user",
        "userName": "user",
        "email": "",
        "providerBlog": "",
        "providerCompany": "",
        "providerLocation": "",
        "providerFollowerCount": 3,
        "providerPrivateGists": null,
        "providerPublicRepoCount": 48,
        "providerPublicGistCount": 2,
        "providerTotalPrivateRepos": null
      }
    ],
    "systemRoles": [
      "user"
    ],
    "created": "2014-09-09T03:31:32.951Z"
  }

===================================== ======== ===================================
Name                                  Type     Description
===================================== ======== ===================================
id                                    string   Account ID
lastUsedIdentityId                    string   id of last used identity. 
identities                            list     A list of this accounts identitiesj
created                               string   When the account was created
===================================== ======== ===================================

**DELETE /accounts/:accountId**
Deletes the specified account

**GET /accounts/:accountId/identities**
A list of identities associated with this account. Your account can have multiple
identities. There will always be at least one identity, and that is the identity
of your linked github or bitbucket account. Another identity your account good take
is the identity of an organization it belongs to.

**GET /accounts/:accountId/integrations**
A list of integrations assoicated with this account
