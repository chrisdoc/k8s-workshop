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
* Enable the ingress controller, so we can test creating ingresses, by running `minikube addons enable ingress`

---
# Workshop Exercises
The first thing to do is to write manifests for the Kubernetes manifest is a description of a _desired state_ of a resource. Three different resource types are going to be needed for this workshop, `deployment`, `service` and `ingress`.

Templates for the manifests can be located under the `deploy/` folder.

## 1. deployment.yml

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
          image: lauriku/k8s-workshop:latest
          ports:
            - containerPort: 3000
```

Now, you should be able to send this manifest to the Kubernetes API, so that it can start building your application.

```bash
kubectl apply -f deploy/deployment.yml
```

You should be able to see the pods starting by writing `kubectl get pods`.

To see that the pod has started properly, you can check the logs with `kubectl logs <pod-name>`

## 2. service.yml

a. Like the `deployment`, the `service` needs a name and a label. The name is important here, as it will be used to link it with the ingress controller in the next step.

```yaml
metadata:
  name: lauriku-svc
  labels:
    app: lauriku-app
```

b. The `spec` of the `service` needs definitions on what port to map to which container, and what protocol to use. `targetPort` is the port that is exposed by the container, and where the service will direct traffic to. `port` can be any port, but for simplicity we'll use the same here.

```yaml
spec:
  ports:
    - port: 3000
      targetPort: 3000
      protocol: TCP
```

c. Lastly, the `service` needs a `selector`, to know which pods to direct traffic to.

```yaml
spec:
  ...
    selector:
      app: lauriku-app
```

The service manifest can be applied the same way as the deployment, so

```bash
kubectl apply -f deploy/service.yml
```

And `kubectl get service -o yaml` should now show detailed information of it.

## 3. ingress.yml

a. You know the drill, the `ingress` controller needs some identifying information, so let's go:

```yaml
metadata:
  name: lauriku-ing
```

b. Then the `spec`. For the `ingress`, this is a set of rules that determine what services traffic is routed to, based on routes for example.

```yaml
spec:
  rules:
  - http:
      paths:
      - path: /.*
        backend:
          serviceName: lauriku-svc
          servicePort: 3000
```

Here we just route all traffic to port 3000 of the `lauriku-svc` service.

Finally, apply this manifest with `kubectl apply -f deploy/ingress.yml`. It can then be inspected by `kubectl get ingress lauriku-svc -o yaml`.

### Setting up connectivity
In order to get the correct ip address and port the deployment from the `docker-machine` that is running `minikube`, run the following snippet, and it should open up a browser pointing to the ingress controller created in the previous step. Replace `lauriku-svc` with the name of your service

```bash
ENDPOINT_HOST=$(minikube ip)
ENDPOINT_PORT=$(kubectl get svc lauriku-svc -o 'jsonpath={.spec.ports[0].servicePort}')
ENDPOINT=$ENDPOINT_HOST:$ENDPOINT_PORT
open $ENDPOINT
```

