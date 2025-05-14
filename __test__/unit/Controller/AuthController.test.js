jest.mock("dotenv", () => ({
    config: jest.fn(),
  }));
  
  // Creamos mocks para las funciones de Prisma
  const mockCreate = jest.fn();
  const mockUserFindFirst = jest.fn();
  const mockRolFindFirst = jest.fn();
  const mockUpdate = jest.fn();
  
  // Mock de PrismaClient
  jest.mock("../../../src/lib/prisma", () => ({
    user: {
      findFirst: mockUserFindFirst,
      create: mockCreate,
      update: mockUpdate
    },
    rol: {
      findFirst: mockRolFindFirst,
    },
  }));
  
  // Mock de bcrypt
  jest.mock("bcryptjs", () => ({
    hash: jest.fn(),
    compare: jest.fn()
  }));
  
  // Mock para generar el token en el momento de autenticación
  jest.mock("jsonwebtoken", () => ({
    sign: jest.fn().mockReturnValue("test_token")
  }));


  jest.mock('../../../src/services/user.service.js', () => ({
    generateCode: jest.fn(),
    sendVerificationEmail: jest.fn(),
    sendVerificationSMS: jest.fn(),
    send2FAEmail: jest.fn(),
    send2FASMS: jest.fn()
  }));


  
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const prisma = require('../../../src/lib/prisma');
  const UserService = require('../../../src/services/user.service.js');
  const signUpRequest = require('../../../src/models/signUpRequest.js')
  const signInRequest = require('../../../src/models/signInRequest.js');
  const verifyCodeRequest = require('../../../src/models/verifyCodeRequest.js');
  const { signUp, signIn, verifyCode, verify2FACode } = require("../../../src/controllers/user.controller");
  
  


  
  // Mock que omite algunos de los console.log del AuthController
  jest.spyOn(console, "log").mockImplementation(() => {});
  
  describe("SignUp Controller Method", () => {
    let req;
    let res;
  
    // Reiniciar mocks antes de cada prueba
    beforeEach(() => {
      jest.clearAllMocks();
      UserService.generateCode.mockReturnValue("123456");
      req = {
        body: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    test("Return message all required fields", async () => {
        // Pasamos el request body de la solicitud
        req.body = {
          // nada se envía
        };
        // Ejecutamos la prueba
        await signUp(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: "Request body is required",
          status:400,
            success: false
        });

      });
    
  
    test("Return message user lenght", async () => {
      req.body = {
        user_name: "test",
          email: "test@gmail.com",
          phone: "3333333333",
          password: "1234567",
          rol_name: "ADMINISTRATOR",
          email_notification: true
        //user_name invalid lenght
      };
      await signUp(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: ["User name must be at least 5 characters long."],
        status:400,
        success: false
      });
    });

    test("Return message email invalid", async () => {
        req.body = {
            user_name: "testes",
            email: "test",
            phone: "3333333333",
            password: "1234567",
            rol_name: "ADMINISTRATOR",
            email_notification: true
            //email invalid format
        };
        await signUp(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: ["Email is invalid."],
          status:400,
        success: false
        });
      });

    test("Return message phone invalid", async () => {
        req.body = {
            user_name: "testes",
            email: "test@gmail.com",
            phone: "333",
            password: "1234567",
            rol_name: "ADMINISTRATOR",
            email_notification: true
          //phone invalid length
        };
        await signUp(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: ["Phone number must be at least 10 digits long."],
          status:400,
        success: false
        });
      });

      test("Return message password invalid", async () => {
        req.body = {
            user_name: "testes",
            email: "test@gmail.com",
            phone: "3333333333",
            password: "12345",
            rol_name: "ADMINISTRATOR",
            email_notification: true
          //lognitud de contraseña inválida
        };
        // Ejecutamos la prueba
        await signUp(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: ["Password must be at least 6 characters long."],
          status:400,
        success: false
        });
      });

      test("Return message role invalid", async () => {
        req.body = {
            user_name: "testes",
            email: "test@gmail.com",
            phone: "3333333333",
            password: "1234567",
            email_notification: true
          //falta el rol
        };
        // Ejecutamos la prueba
        await signUp(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: ["Role name is required."],
          status:400,
        success: false
        });
      });

      test("Return message email_notification invalid", async () => {
        req.body = {
          user_name: "testes",
          email: "test@gmail.com",
          phone: "3333333333",
          password: "1234567",
          rol_name: "ADMINISTRATOR",
          email_notification: ""
        };
        // Ejecutamos la prueba
        await signUp(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: ["Email notification must be a boolean value."],
          status:400,
        success: false
        });
      });

      test("Return message role does not exist", async () => {
        req.body = {
          user_name: 'testuser',
          email: 'test@example.com',
          phone: '3333333333',
          password: 'pass123',
          rol_name: 'None',
          email_notification: true
        };
        
        signUpRequest.validate = jest.fn().mockReturnValue(null);
        prisma.user.findFirst.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashed_password');
        UserService.generateCode = jest.fn().mockReturnValue('123456');
        prisma.rol.findFirst.mockResolvedValue(null);
        
        await signUp(req, res);
        
        
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          status: 400,
          message: "Role does not exist"
        });
      });
    
    test("Should return error if email already exists", async () => {
        req.body = {
            user_name: "testes",
            email: "test@gmail.com",
            phone: "3333333333",
            password: "1234567",
            rol_name: "ADMINISTRATOR",
            email_notification: true
          };
  
      // Configuramos el comportamiento del mock
        prisma.user.findFirst.mockResolvedValue({
        id: 1,
        user_name: "testes",
        email: "test@gmail.com",
      });
  
      await signUp(req, res);
  
      expect(prisma.user.findFirst).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User already exists",
        success: false,
        status: 400,
      });
    });
  
    // test("Should create a user successfully", async () => {
    //     req.body = {
    //         user_name: "testes",
    //         email: "test@gmail.com",
    //         phone: "3333333333",
    //         password: "1234567",
    //         rol_name: "ADMINISTRATOR",
    //         email_notification: true
    //       };
  
    //   // Usuario no existe
    //   prisma.user.findFirst.mockResolvedValue(null);
    //   prisma.rol.findFirst.mockResolvedValue({ name: "ADMINISTRATOR" });
  
    //   // Configurar mock para el hash
    // const hashedPassword = "hashed_password";
    // bcrypt.hash.mockResolvedValue(hashedPassword);
    // UserService.generateCode.mockReturnValue('123456');
    // prisma.user.create.mockResolvedValue({ id: 1,
    //         user_name: "testes",
    //         email: "test@gmail.com"});
    //   await signUp(req, res);
    // expect(UserService.sendVerificationEmail).toHaveBeenCalledWith("test@gmail.com","123456", 'testes');
    // expect(res.status).toHaveBeenCalledWith(201);
    //   expect(res.json).toHaveBeenCalledWith({
    //     message: "User created, please check your email or phone for the verification code"
    //   });
    // });

    test("Should handle server error during sign in", async () => {
        req.body = {
            user_name: "testes",
            email: "test@gmail.com",
            phone: "3333333333",
            password: "1234567",
            rol_name: "ADMINISTRATOR",
            email_notification: true
          };
        
        // Simulamos un error en la base de datos
        prisma.user.findFirst.mockImplementation(() => {
            throw new Error("Database error");
          });
        
        await signUp(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: "User was not created",
          error: "Database error",
          success: false,
            status: 500,
        });
      });
  });
  
  describe("SignIn Controller Method", () => {
    let req;
    let res;
  
    // Reiniciar mocks antes de cada prueba
    beforeEach(() => {
      jest.clearAllMocks();
      req = {
        body: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
    test("Return message all required fields", async () => {
        // Pasamos el request body de la solicitud
        req.body = null;
        // Ejecutamos la prueba
        await signIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: "Request body is required",
          status:400,
            success: false
        });

      });
      test("Should return 400 if validation fails", async () => {
        req.body = { user_name: "", password: "" };
        signInRequest.validate = jest.fn().mockReturnValue("Validation error");
      
        await signIn(req, res);
      
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          status: 400,
          message: "Validation error"
        });
      });
      test("Should return 400 if user does not exist", async () => {
        req.body = { user_name: "noUser", password: "123456" };
        signInRequest.validate = jest.fn().mockReturnValue(null);
        prisma.user.findFirst = jest.fn().mockResolvedValue(null);
      
        await signIn(req, res);
      
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          status: 400,
          message: "User does not exist"
        });
      });
      test("Should return 400 if password is invalid", async () => {
        req.body = { 
            user_name: "user", 
            password: "wrongpass" 
        };
        signInRequest.validate = jest.fn().mockReturnValue(null);
        prisma.user.findFirst = jest.fn().mockResolvedValue({ 
            password: "hashed_pass" 
        });
        bcrypt.compare = jest.fn().mockResolvedValue(false);
      
        await signIn(req, res);
      
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          status: 400,
          message: "Invalid password"
        });
      });

      test("Should return 400 if user is not active", async () => {
        req.body = { 
            user_name: "user", 
            password: "123456" 
        };
        signInRequest.validate = jest.fn().mockReturnValue(null);
        const user = { 
            id: 1, 
            user_name: "user", 
            password: "123456", 
            status: "PENDING" 
        };
        prisma.user.findFirst.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);
      
        await signIn(req, res);
      
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          status: 400,
          message: "User is not active"
        });
      });

      // test("Should send 2FA and return 200", async () => {
      //   const testCode = "123456";
      //   const testuser_name = "user";
        
      //   req.body = {
      //     user_name: testuser_name,
      //     password: "123456",
      //     email_notification: true
      //   };
      
      //   jest.mock('../../../src/services/user.service.js', () => ({
      //     generateCode: jest.fn().mockReturnValue("123456"),
      //     sendVerificationEmail: jest.fn(),
      //     sendVerificationSMS: jest.fn(),
      //     send2FAEmail: jest.fn(),
      //     send2FASMS: jest.fn()
      //   }));
        
      //   const mockUserService = require('../../../src/services/user.service.js');
        
      //   signInRequest.validate = jest.fn().mockReturnValue(null);
        
      //   const user = {
      //     id: 1,
      //     user_name: testuser_name,
      //     email: "test@gmail.com",
      //     phone: "3333333333",
      //     password: "hashed_pass",
      //     status: "ACTIVE"
      //   };
        
      //   prisma.user.findFirst.mockResolvedValue(user);
      //   bcrypt.compare.mockResolvedValue(true);
      //   prisma.user.update.mockResolvedValue({});
        
      //   await signIn(req, res);
        
      //   expect(mockUserService.send2FAEmail).toHaveBeenCalledWith(
      //     "test@gmail.com", 
      //     "123456", 
      //     testuser_name
      //   );
      //   expect(res.status).toHaveBeenCalledWith(200);
      //   expect(res.json).toHaveBeenCalledWith({
      //     success: true,
      //     status: 200,
      //     message: "2FA code sent, please check your email or phone for the verification code"
      //   });
      // });

      test("Should handle server error during sign in", async () => {
        req.body = {
            user_name: "testes",
            email: "test@gmail.com",
            phone: "3333333333",
            password: "1234567",
            rol_name: "ADMINISTRATOR",
            email_notification: true
          };
        
        // Simulamos un error en la base de datos
        prisma.user.findFirst.mockImplementation(() => {
            throw new Error("Database error");
          });
        
        await signIn(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: "Error signing in",
          error: "Database error",
          success: false,
            status: 500,
        });
      });
    });
      describe("VerifyCode Controller Method", () => {
        let req;
        let res;
    
        // Reiniciar mocks antes de cada prueba
        beforeEach(() => {
        jest.clearAllMocks();
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        });
      test("Return message all required fields", async () => {
        // Pasamos el request body de la solicitud
        req.body = null;
        // Ejecutamos la prueba
        await verifyCode(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: "Request body is required",
          status:400,
          success: false
        });
      });
      test("Should return error if validation fails", async () => {
        req.body = { 
            user_name: "", 
            code: "" 
        };
        verifyCodeRequest.validate= jest.fn().mockReturnValue("Validation error");
        await verifyCode(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          message: "Validation error",
          status:400,
          success: false
        }));
      });
      test("Should return 400 if user does not exist", async () => {
        req.body = { user_name: "nonexistent", code: "123456" };
        verifyCodeRequest.validate= jest.fn().mockReturnValue(null);
        prisma.user.findFirst.mockResolvedValue(null);
    
        await verifyCode(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          message: "User does not exist",
          status:400,
          success: false
        }));
      });
      test("Should return 400 if code is invalid", async () => {
        req.body = { user_name: "user", code: "000000" };
        verifyCodeRequest.validate= jest.fn().mockReturnValue(null);
        prisma.user.findFirst.mockResolvedValue({
          id: 1,
          verification_code: "123456",
          verification_code_expiration: new Date(Date.now() + 60000)
        });
    
        await verifyCode(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          message: "Invalid verification code",
          status:400,
          success: false
        }));
      });
      test("Should return 400 if code is expired", async () => {
        req.body = { user_name: "user", code: "123456" };
        verifyCodeRequest.validate= jest.fn().mockReturnValue(null);
        prisma.user.findFirst.mockResolvedValue({
          id: 1,
          verification_code: "123456",
          verification_code_expiration: new Date(Date.now() - 60000) // expired
        });
    
        await verifyCode(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          message: "Verification code expired",
          status:400,
          success: false
        }));
      });
      test("Should activate user successfully", async () => {
        req.body = { user_name: "user", code: "123456" };
        verifyCodeRequest.validate= jest.fn().mockReturnValue(null);
        prisma.user.findFirst.mockResolvedValue({
          id: 1,
          verification_code: "123456",
          verification_code_expiration: new Date(Date.now() + 60000)
        });
    
        prisma.user.update.mockResolvedValue({});
    
        await verifyCode(req, res);
    
        expect(prisma.user.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: {
            status: "ACTIVE",
            verification_code: null,
            verification_code_expiration: null
          }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            status: 200,
            message: "User verified successfully"
        }));
    });
    test("Should return 500 if an exception occurs", async () => {
        req.body = { user_name: "user", code: "123456" };
        verifyCodeRequest.validate.mockReturnValue(null);
        prisma.user.findFirst.mockRejectedValue(new Error("DB error"));
    
        await verifyCode(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          message: "Error verifying user",
          error: "DB error"
        }));
      });
  });

  describe("Verify2FACode Controller Method", () =>{
    let req;
    let res;
    
    // Reiniciar mocks antes de cada prueba
    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    test("Return message all required fields", async () => {
        // Pasamos el request body de la solicitud
        req.body = null;
        // Ejecutamos la prueba
        await verify2FACode(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            status: 400,
            message: "Request body is required"
        });
      });
    test("Should return error if validation fails", async () => {
        req.body = { 
            user_name: "", 
            code: "" 
        };
        verifyCodeRequest.validate= jest.fn().mockReturnValue("Validation error");
        await verify2FACode(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          message: "Validation error",
          status:400,
          success: false
        }));
    });
    test("Should return 400 if user does not exist", async () => {
        req.body = { user_name: "nonexistent", code: "123456" };
        verifyCodeRequest.validate= jest.fn().mockReturnValue(null);
        prisma.user.findFirst.mockResolvedValue(null);
    
        await verify2FACode(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          message: "User does not exist",
          status:400,
          success: false
        }));
      });
    test("Should return 400 if code is invalid", async () => {
        req.body = { user_name: "user", code: "000000" };
        verifyCodeRequest.validate= jest.fn().mockReturnValue(null);
        prisma.user.findFirst.mockResolvedValue({
          id: 1,
          two_fa_code: "123456",
          two_fa_expiration: new Date(Date.now() + 60000)
        });
    
        await verify2FACode(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          message: "Invalid verification code",
          status:400,
          success: false
        }));
      });
    test("Should return 400 if code is expired", async () => {
        req.body = { user_name: "user", code: "123456" };
        verifyCodeRequest.validate= jest.fn().mockReturnValue(null);
        prisma.user.findFirst.mockResolvedValue({
          id: 1,
          two_fa_code: "123456",
          two_fa_expiration: new Date(Date.now() - 60000) // expired
        });
    
        await verify2FACode(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          message: "Verification code expired",
          status:400,
          success: false
        }));
    });
    test("Should activate user successfully", async () => {
        req.body = { 
            user_name: "user", 
            code: "123456" 
        };
        const mockUser = {
            id: 1,
            user_name: "testuser",
            email: "test@example.com",
            phone: "1234567890",
            two_fa_code: "123456",
            two_fa_expiration: new Date(Date.now() + 10000),
            rolId: 2
          };
        const mockRol = {
            permissions: ['READ', 'WRITE']
          }; 
        verifyCodeRequest.validate= jest.fn().mockReturnValue(null);
        prisma.user.findFirst.mockResolvedValue(mockUser);
        prisma.rol.findFirst.mockResolvedValue(mockRol);
        prisma.user.update.mockResolvedValue({});
        jwt.sign.mockReturnValue("mocked_token");
    
        await verify2FACode(req, res);

        expect(jwt.sign).toHaveBeenCalledWith({
            id: mockUser.id,
            user_name: mockUser.user_name,
            email: mockUser.email,
            phone: mockUser.phone,
            permissions: mockRol.permissions
          }, process.env.JWT_SECRET, { expiresIn: '1h' });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "login successfully",
            token: "mocked_token"
          }));
    });
    test("Should return 500 if an exception occurs", async () => {
        req.body = { user_name: "user", code: "123456" };
        verifyCodeRequest.validate.mockReturnValue(null);
        prisma.user.findFirst.mockRejectedValue(new Error("DB error"));
    
        await verify2FACode(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          message: "Error verifying user",
          error: "DB error"
        }));
      });

  });