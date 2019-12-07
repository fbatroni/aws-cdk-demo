import cdk = require('@aws-cdk/core');
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import * as route53 from "@aws-cdk/aws-route53";
import * as s3 from "@aws-cdk/aws-s3";
import { s3Bucket } from '../../config';
import { Duration } from '@aws-cdk/core';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "vpc", {
      maxAzs: 2,
      cidr: "172.100.0.0/16",
    })

    const ecsCluster = new ecs.Cluster(this, "cluster", {
      clusterName: "this-is-so-cool",
      vpc: vpc
    })

    const fargate = new ecsPatterns.ApplicationLoadBalancedFargateService(this, "fargate", {
      cluster: ecsCluster,
      publicLoadBalancer: true,
      serviceName: "my-cool-service",
      healthCheckGracePeriod:Duration.seconds(5),
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset("../service/"),
        containerPort: 8080
      },
      domainName: "aws-community-day.aspecto.technology",
      domainZone: route53.HostedZone.fromLookup(this, "zone", {
        domainName: "aspecto.technology"
      })
    })

    const bucket = new s3.Bucket(this, "s3", { bucketName: s3Bucket });
    bucket.grantReadWrite(fargate.taskDefinition.taskRole)

  }
}
