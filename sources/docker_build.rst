:title: Custom Containers with Docker Build
:description: Running minions in a Docker container defined by a Dockerfile
:keywords: shippable, Docker, Container

.. _docker_build

.. warning::
  Docker Build Support is for dedicates hosts only!

Docker Build Support
==========================
In addition to pointing to a Docker image on Docker Hub, you can also run your 
build in a custom docker container by instructing us to build a Docker image
from a Dockerfile. Aside from providing a custom environment for your build,
the image created can be pushed to your Docker Hub account, for later
use in your deployment step.

**Step 1** : Setup Dedicated host
Docker Build Support is for builds running on dedicated hosts only. To use this
feature you must first setup at least one dedicated host for your account.

**Step 2** : Dockerfile and App Dockerization
To use Docker Build with your builds, you must include a Dockerfile in the root
directory of your app. Furthermore, this Dockerfile must be commited to the
repo that you have configured Shippable to pull from, such as your team's
Github repo.

In order for your build to run succesfully, you must properly "dockerize" your
application. Details on this can be found in Docker's official documentation `Docker's official documentation <https://docs.dockerhub.com>`_.
You can also look at our `Docker build sample app <https://github.com/cadbot/dockerized-nodejs`

**Step 3** : Enable Docker Build for your Project and Set Configurations
Finally, you must configure your app to use Docker Build through the Shippable
Project Dashboard. To do this, go to the setting settings tab on your project's page.
From here, expand the Project settings option. On the Build image dropdown menu,
select "Custom image". For the Custom image action dropdown select build. Then,
you must specify a Custom image name and your Source code path. If you want to
later push your image to Docker Hub, you should refer to the image by name you
specified here. The source code path specifies where you have installed your 
app's source code on the running Docker container.
