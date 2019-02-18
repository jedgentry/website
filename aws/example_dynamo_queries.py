import boto3
from boto3.dynamodb.conditions import Key
import json

client = boto3.resource('dynamodb')
personal_website_table = client.Table('personal-website')
personal_website_latest_table = client.Table('personal-website-latest')

print("One blog")
response = personal_website_table.query(
    IndexName='blog_index',
    KeyConditionExpression=Key('blog-id').eq(0)
)
print(response['Items'][0])

print("Blog range")
response = personal_website_table.scan(
    IndexName='blog_index',
    FilterExpression=Key('blog-id').between(0, 5)
)

print(response['Items'])

print("Project range")
response = personal_website_table.scan(
    IndexName='projects_index',
    FilterExpression=Key('project-id').between(0, 5)
)

print(response['Items'])

print("Getting highest blog element")
response = personal_website_latest_table.query(
    KeyConditionExpression=Key('latest-index').eq('blog')
)
print(response['Items'][0]['blog-id'])

print("Getting higest project element")
response = personal_website_latest_table.query(
    KeyConditionExpression=Key('latest-index').eq('project')
)
print(response['Items'][0]['project-id'])
