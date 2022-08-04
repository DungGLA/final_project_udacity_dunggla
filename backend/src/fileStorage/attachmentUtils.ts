import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3Bucket = process.env.ATTACHMENT_S3_BUCKET
const urlExpired = process.env.SIGNED_URL_EXPIRATION
export function getUploadUrlById(todoId: string) {
    const s3 = new XAWS.S3({ signatureVersion: 'v4' })
    return s3.getSignedUrl('putObject', {
        Bucket: s3Bucket,
        Key: todoId,
        Expires: Number(urlExpired)
    })
}