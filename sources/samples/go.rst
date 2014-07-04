:title: Go Samples
:description: A brief description about sample_go
:keywords: Go, Golang, Language, version number, Notification alerts

.. _go:

go-samples
=============
 
This sample will help you get started with Shippable. The testing framework used here is
`Ginkgo <http://onsi.github.io/ginkgo/>`_ .

`Go Sample <https://github.com/Shippable/sample_go>`_

`Go Sample with MongoDB <https://github.com/Shippable/sample_go_mongo>`_

Copy the test and code coverage output into the special folders Shippable/testresults and Shippable/codecoverage to get the reports parsed. The test report must be in JUnit format.

We need the yml file to analyze your project details. So add the shippable.yml file to the root of your repo by specifying:

**language :** Go is used in this sample project

**version number :** 1.2 is the version used in this sample project.


Here is the complete yml file for sample_go

.. code-block:: bash

	language: go

	go:
	  - 1.2

	install:
	  - go get code.google.com/p/go.tools/cmd/cover

	# Make folders for the reports
	before_script:
	  - mkdir -p shippable/testresults
	  - mkdir -p shippable/codecoverage

	script:
	  - export GOPATH=$PWD
	  - export PATH=$PATH:$GOPATH/bin
	  - go get github.com/t-yuki/gocover-cobertura
	  - go get github.com/onsi/gomega
	  - go get github.com/onsi/ginkgo
	  - go install github.com/OneRedOak/sample
	  - go test -coverprofile=coverage.txt -covermode count github.com/OneRedOak/sample
	  - gocover-cobertura < coverage.txt > coverage.xml

	after_script:
	  - mv $PWD/src/github.com/OneRedOak/sample/junit.xml $PWD/shippable/testresults/
	  - mv $PWD/coverage.xml $PWD/shippable/codecoverage/

Enable the repo sample_go and run it using an Ubuntu minion. Once the build finishes execution, you can check for the console output, test and codecoverage results on the respective build's page.
