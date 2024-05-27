# Test ECommerce Project
---

## Question 1: Microservice Architecture

### Detailed Design

#### 1. User Service

  - Manage user registrations, logins, and profile updates.
  - Handle authentication and authorization.
  - Securely store user credentials (e.g., using hashed passwords).

#### 2. Product Service

  - Manage product catalog (add, update, delete products).
  - Provide product details and search functionality.

#### 3. Order Service

  - Manage orders (create, view, update order status).
  - Track order history and status.

### Communication

- **API Gateway**: Acts as a single entry point for all clients (e.g., NGINX, Kong). Routes requests to appropriate services.
- **Service Discovery**: Ensures services can find each other (e.g., using Consul or Eureka).
- **Messaging Queue**: For asynchronous communication between services if needed (e.g., RabbitMQ, Kafka).

### Security

- **Authentication**: Managed by the User Service using JWT.
- **Authorization**: Role-based access control for different endpoints.

### Deployment

- **Containerization**: Use Docker to containerize each service.
- **Orchestration**: Use Docker-Compose/Kubernetes to manage containers.
- **CI/CD**: Set up a CI/CD pipeline using Jenkins, GitHub Actions, or similar tools.

This architecture ensures each service is isolated, scalable, and manageable, promoting ease of maintenance and deployment. Each service can be developed, deployed, and scaled independently, making the system more resilient and flexible.

## Question 2: Database Design

### User Model

The user collection will store user information, such as personal details, authentication credentials, and roles.

```typescript
import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    admin: boolean
}

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,
    }
});

// Adding indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ name: 1 });

const UserModel = mongoose.model<IUser>("User", UserSchema);

export { IUser, UserModel };
```

### Session Model

The session collection will store session information for users, such as login timestamps and session tokens.

```typescript
import mongoose, { Document, Schema } from "mongoose";

interface ISession extends Document {
    user_id: mongoose.Schema.Types.ObjectId,
    session_token: string,
    created_at: Date,
    expires_at: Date,
    ip_address: string,
    user_agent: string
}

const SessionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    session_token: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    expires_at: {
        type: Date,
        required: true,
    },
    ip_address: {
        type: String,
    },
    user_agent: {
        type: String,
    }
});

// Adding indexes
SessionSchema.index({ user_id: 1 });
SessionSchema.index({ session_token: 1 });
SessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

const SessionModel = mongoose.model<ISession>("Session", SessionSchema);

export { ISession, SessionModel };
```

## Question 3: Docker Deployment

Here's a Dockerfile for the User Service using express.js, MongoDB.

```yaml
#Build stage
FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

#Production stage
FROM node:16-alpine AS production

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]
```

## Question 4: AWS Deployment

1. **Prepare Docker Image**
   - **Build Image:** `docker build -t user-service .`
   - **Tag Image:** `docker tag user-service:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/user-service:latest`
   - **Login to ECR:** `aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com`
   - **Push Image:** `docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/user-service:latest`

2. **Set Up AWS Resources**
   - **Create ECR Repository:**
     - Go to ECR, create a repository named `user-service`.
   - **Create ECS Cluster:**
     - Go to ECS, create a new cluster.
   - **Create Task Definition:**
     - Go to ECS, create a new task definition.
     - Add container details (use the ECR image URI, set memory, CPU, and port mappings).
   - **Create Service:**
     - Go to ECS, create a service using the task definition.
     - Configure networking (VPC, subnets, security groups).

3. **Deploy and Test**
   - **Deploy Service:**
     - Start the service in the ECS cluster.
   - **Get Public IP/DNS:**
     - Retrieve from the ECS tasks or associated load balancer.
   - **Test API:**
     - Use Postman or a similar tool to verify the API.

## Question 5: AWS S3 Signed URLs

```javascript
const AWS = require('aws-sdk');

// Configure AWS SDK
const s3 = new AWS.S3({
  region: 'your-region',
  accessKeyId: 'your-access-key-id', // Use environment variables for production
  secretAccessKey: 'your-secret-access-key' // Use environment variables for production
});

// Function to generate a signed URL for uploading a file
const generateUploadSignedUrl = async (bucketName, key, expiresIn = 3600) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: expiresIn,
    ContentType: 'application/octet-stream' // Set the content type according to your file type
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);
    return url;
  } catch (error) {
    console.error('Error generating upload signed URL', error);
    throw error;
  }
};

// Function to generate a signed URL for downloading a file
const generateDownloadSignedUrl = async (bucketName, key, expiresIn = 3600) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: expiresIn
  };

  try {
    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;
  } catch (error) {
    console.error('Error generating download signed URL', error);
    throw error;
  }
};
```

## Question 6: Security Best Practices

1. **Use HTTPS:**
   - Ensures data transmitted between the client and server is encrypted, preventing interception and reading of sensitive information.

2. **Implement Input Validation and Sanitization:**
   - Prevents injection attacks by ensuring inputs are in the expected format and removing potentially harmful code.

3. **Set Security Headers:**
   - Protects your application from various types of attacks by instructing the browser on how to behave with your site.

4. **Protect Against Cross-Site Request Forgery (CSRF):**
   - Prevents CSRF attacks that trick users into performing unintended actions by validating CSRF tokens.

5. **Limit Rate of Requests:**
   - Mitigates the risk of brute-force and denial-of-service (DoS) attacks by limiting the number of requests a user can make in a given period.

## Question 7: JSON Web Token (JWT)

Sure, here are the short answers:

To generate a JWT:
```typescript
import jwt from "jsonwebtoken";
import IJwt from "../service/interface/jwt.interface";

class Jwt implements IJwt {
    sign(payload: object): string {
        const jwtKey = process.env.JWT_KEY || 'secret';
        return jwt.sign(payload, jwtKey, { expiresIn: '1h' });
    }
}

export default Jwt;
```

To verify a JWT:
```typescript
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AuthRequest from "../dto/request.dto";

function verify(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    const jwtKey = process.env.JWT_KEY || 'secret';
    jwt.verify(token, jwtKey, (err: any, data: any) => {
        if (err) return res.sendStatus(403);
        req.user = data;
        next();
    });
}

export default verify;
```

## Question 8: CI/CD Pipeline

To set up a CI/CD pipeline for the User Service using GitHub Actions and deploy to AWS ECS:

1. Create a GitHub repository for the User Service.
2. Set up an AWS ECS cluster and define IAM roles for access.
3. Configure a GitHub Actions workflow (e.g., `ci-cd.yml`) to build, test, and deploy the User Service.
4. Define environment variables securely for the User Service.
5. Ensure thorough testing and quality assurance checks in the workflow.
6. Choose a deployment strategy and configure it in the workflow.
7. Implement monitoring and logging for the deployed service.
8. Include automated rollback mechanisms in case of deployment failures.
9. Document the pipeline setup and regularly maintain it to accommodate changes.

## Question 9: Version Control

1. **main:** This branch represents the production-ready code. It should always contain stable and tested code that is ready for deployment to the production environment.

2. **develop:** The develop branch serves as the main integration branch for ongoing development. Developers merge their feature branches into this branch when they complete their work.

3. **qa:** QA branches are created from the develop branch to perform quality assurance testing. This branch allows QA teams to thoroughly test new features and fixes in an isolated environment before promoting changes to production.

4. **hotfix:** Hotfix branches are created from the main branch to address critical bugs or issues in the production environment. Once the fixes are complete, they are merged back into both the main branch and the develop branch to ensure that the changes are reflected in future releases.

5. **staging:** Staging branches are created from the develop branch to prepare for testing in a staging environment. This branch is used for pre-release testing and validation before deploying changes to production.

## Question 10: Unit Testing

```javascript
describe('UserService register function', () => {
  // Mocking UserRepository
  const mockUserRepository = {
    findByEmail: jest.fn(),
    save: jest.fn(),
  };

  // Mocking HashPassword
  const mockHashPassword = {
    create: jest.fn(),
  };

  // Mocking JWT
  const mockJwt = {
    sign: jest.fn(),
  };

  // Creating an instance of UserService with mocked dependencies
  const userService = new UserService(
    mockUserRepository as any,
    mockHashPassword as any,
    mockJwt as any,
  );

  // Test case for successful user registration
  it('should register a new user successfully', async () => {
    // Mocking user data
    const userDto: RegisterUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    // Mocking findByEmail to return null (user does not exist)
    mockUserRepository.findByEmail.mockResolvedValue(null);

    // Mocking hashPassword.create to return hashed password
    mockHashPassword.create.mockResolvedValue('hashedPassword123');

    // Mocking save to return saved user data
    const savedUser: User = {
      _id: '123',
      name: userDto.name,
      email: userDto.email,
      password: 'hashedPassword123',
      admin: false,
    };
    mockUserRepository.save.mockResolvedValue(savedUser);

    // Mocking JWT sign to return token
    mockJwt.sign.mockReturnValue('jwtToken123');

    // Calling the register function
    const result = await userService.register(userDto);

    // Assertions
    expect(result.status).toBe(201);
    expect(result.data).toEqual(savedUser);
  });
});
```

## Question 11: Mock Testing

```javascript
describe('PaymentService processPayment function', () => {
  // Mocking ExternalPaymentService
  const mockExternalPaymentService = {
    processPayment: jest.fn(),
  };

  // Creating an instance of PaymentService with mocked dependencies
  const paymentService = new PaymentService(mockExternalPaymentService as any);

  // Test case for successful payment processing
  it('should process payment successfully', async () => {
    // Mocking payment data
    const paymentData = {
      amount: 100,
      currency: 'USD',
      cardNumber: '1234567890123456',
      expiryMonth: '12',
      expiryYear: '25',
      cvv: '123',
    };

    // Mocking processPayment function of ExternalPaymentService
    mockExternalPaymentService.processPayment.mockResolvedValue({
      transactionId: 'transaction123',
      status: 'success',
    });

    // Calling the processPayment function
    const result = await paymentService.processPayment(paymentData);

    // Assertions
    expect(result).toEqual({
      transactionId: 'transaction123',
      status: 'success',
    });
  });

  // Test case for failed payment processing
  it('should handle failed payment processing', async () => {
    // Mocking payment data
    const paymentData = {
      amount: 100,
      currency: 'USD',
      cardNumber: '1234567890123456',
      expiryMonth: '12',
      expiryYear: '25',
      cvv: '123',
    };

    // Mocking processPayment function of ExternalPaymentService to throw an error
    mockExternalPaymentService.processPayment.mockRejectedValue(new Error('Payment failed'));

    // Calling the processPayment function
    await expect(paymentService.processPayment(paymentData)).rejects.toThrow('Payment failed');
  });
});
```