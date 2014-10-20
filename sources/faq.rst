:title: FAQ
:description: Commonly asked questions that will help with troubleshooting
:keywords: concepts, documentation, shippable, CI/CD

.. _faq:

FAQ
===
Having trouble with your builds? Here is a list of frequently asked questions.... hope this helps!

**Linking accounts**
---------------------

**How do I link my github and bitbucket accounts?**

Shippable allows you to link both github and bitbucket service providers into a single account. Click on the bitbucket icon or github icon on the top right to link the respective account from the dashboard page.

For example: Sign in to shippable with your github account and click on the bitbucket icon on the top right to link your bitbucket account.

If you have already logged in to shippable with both the service providers account separately, then it will not allow you to link the accounts. You have to delete one of your shippable account and then click on the respective service provider icon from the other account. Deleting the account will also remove all its associated projects and builds, so first you need to decide which account you want to delete and then delete the account from the profile dropdown.

**Account deletion**
----------------------

**Why am I not able to see bitbucket org repos after recreating my account?**
 
Deleting the shippable account will also delete all the permissions associated with the account. If you recreate your account, bitbucket will not allow us to pull all the permissions you have, unless the owner of that organization logs in back to shippable and then click on the sync repos button to see the repos. 


**setting timezone**
---------------------

**How to set desired timezones inside the minions?**

By default, our minions are configured with ETC/UTC timezone which is set in /etc/timezone file for ubuntu minions. However, we allow you to set a specific time zone for the minion in before_script section of your yml file . For example, 

.. code-block:: python
        
   before_script:
     - echo 'Europe/Paris' | sudo tee /etc/timezone
     - sudo dpkg-reconfigure --frontend noninteractive tzdata

This will change your minion timezone to paris time. Refer the article `list of tz database time zones <http://en.wikipedia.org/wiki/List_of_tz_database_time_zones>`_  to select the timezone for your location.
 
