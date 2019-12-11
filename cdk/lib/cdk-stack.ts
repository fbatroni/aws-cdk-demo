import cdk = require('@aws-cdk/core');
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import * as route53 from "@aws-cdk/aws-route53";
import * as s3 from "@aws-cdk/aws-s3";
import { s3Bucket } from '../../service/config';
import { Duration } from '@aws-cdk/core';
import { EcrImage } from '@aws-cdk/aws-ecs';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this,"my-vcp",{
      cidr:"172.100.0.0/16",
    });

    const ecsCluster = new ecs.Cluster(this,"my-clsuter",{});

    const fargate = new ecsPatterns.ApplicationLoadBalancedFargateService(this,"my-fargate",
    {
      cluster:ecsCluster,
      domainName:"aws-community-day.aspecto.technology",
      domainZone: route53.HostedZone.fromLookup(this,"my-53",{
        domainName:"aspecto.technology"
      }),
      publicLoadBalancer:true,
      serviceName:"my-service",
      taskImageOptions:{
        containerPort:8080,
        image: ecs.EcrImage.fromAsset("../service")
      }
    })

    const bucket = new s3.Bucket(this,"my-bucket",{
      bucketName:s3Bucket
    })

    bucket.grantReadWrite(fargate.taskDefinition.taskRole);
  }
}
