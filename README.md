# Kubernetes workshop 5th Jun 2018
This repo contains the files, documentation and exercises used in the Kubernetes workshop held at adidas HQ in Amsterdam on the 5th of June 2018.

---

# Introduction
The goals of this workshop are:

* Understand what is Kubernetes
* Understand the most commonly used concepts/terms associated with k8s
* Learn how to write k8s manifests
* Learn how to handle deployments and upgrades of an application
* Learn how an application is scaled manually or dynamically

# Getting started
Make sure you have `docker`, `minikube` and `kubectl` installed.

* Fork this repository, `https://github.com/lauriku/k8s-workshop.git`
* Clone it

## Running the container locally
* `docker build -t <username>/k8s-workshop .`
* `docker run -it --rm -p 3000:3000 <username>/k8s-workshop``
* Browse [localhost:3000](http://localhost:3000)

## Creating a docker hub account
TBD!!

* Create a docker hub account
* Create an automated build
* Image can now be pulled by `docker pull <username>/k8s-workshop:latest`

---

# Prep local environment
## minikube
minikube is an implementation of a local Kubernetes cluster, that can be used when testing manifests, deployments and so on.
* Run `minikube start` to get the cluster running
* `kubectl` now has configuration pointing to this local cluster, for this terminal session
* Try running `kubectl get cluster-info`
* Double check what cluster you are pointing at if you use an another terminal session

---
# Workshop Exercises
The first thing to do is to write manifests for the Kubernetes manifest is a description of a _desired state_ of a resource. Three different resource types are going to be needed for this workshop, `deployment`, `service` and `ingress`.

Templates for the manifests can be located under the `deploy/` folder.

### 1. deployment.yml

a. Give the `deployment` resource a name. This can then be used to later access the resource, to update or delete it for example.

```yaml
metadata:
  name: lauriku-app
```

b. Start writing the `template: spec` for the `deployment`. This defines the Pod template that describes which containers are to be launched. In order for other resources to route traffic to the pods, the pods need a `label`.
```yaml
spec:
  template:
    metadata:
      labels:
        app: lauriku-app
```

c. Next, define the containers to be run in these pods. The container needs a `name`, `image`and a `containerPort`. The `image` field refers to the image now stored in the docker hub repository. The `containerPort` should the same port that container exposes, and the process inside the container listens to.

```yaml
spec:
  template:
  ...
    spec:
      containers:
        - name: lauriku-app
          inage: lauriku/k8s-workshop:latest
          ports:
            - containerPort: 3000
```

Now, you should be able to send this manifest to the Kubernetes API, so that it can start building your application.

```bash
kubectl apply -f deploy/deployment.yml
```

You should be able to see the pods starting by writing `kubectl get pods`

### Setting up connectivity
```bash
ENDPOINT_HOST=$(minikube ip)
ENDPOINT_PORT=$(kubectl get svc k8s-workshop -o 'jsonpath={.spec.ports[0].nodePort}')
ENDPOINT=$ENDPOINT_HOST:$ENDPOINT_PORT
```

