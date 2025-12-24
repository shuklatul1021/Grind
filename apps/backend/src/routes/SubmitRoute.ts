import Router from "express";
import { UserAuthMiddleware } from "../middleware/user.js";
import { Sandbox } from '@e2b/code-interpreter';
import { ComilerRateLimiter } from "../limiter/RateLimiter.js";
import { prisma } from "@repo/db/DatabaseClient";
const poblemsubmitRouter = Router();

poblemsubmitRouter.post("/submitcode/:problemId" , ComilerRateLimiter , async(req, res)=>{
    try{
        const { code, language} = req.body;
        const problemId = req.params.problemId;

        if(!problemId){
            return res.status(400).json({
                message : "Problem Id Require",
                success : false
            });
        }
        
        if (!code || !language) {
            return res.status(400).json({
                message: "Please Provide All The Required Fields",
                success: false
            });
        }

        const supportedLanguages = ['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust'];
        if (!supportedLanguages.includes(language)) {
            return res.status(400).json({
                message: `Language '${language}' is not supported. Supported: ${supportedLanguages.join(', ')}`,
                success: false
            });
        }

        const sandbox = await Sandbox.create({
            apiKey: process.env.E2B_API_KEY!,
            timeoutMs: 60000 
        });

        const getTestCase = await prisma.challenges.findFirst({
            where : {
                id : problemId
            },
            select : {
                testcase : true 
            }
        });
        if(!getTestCase){
            return res.status(404).json({
                message : "Test Case Not Found For This Problem",
                success : false
            });
        }
        /**@CHECK FIRST CODE BEFORE RUNNING ALL TEST CASES
         * This section checks the syntax and runs the code against the first test case to ensure correctness before proceeding with all test cases.
         * It Reduces unnecessary executions if the code has syntax errors or fails the initial test case.
         */
        const test = getTestCase.testcase[0]?.testcasecode;
        const FirstTestCaseExprectation = getTestCase.testcase[0]?.expectedOutput;
        const syntexCheck = JSON.parse(test || "[]");
        const isLanguagePresent = syntexCheck.filter((item: { language: string; code: string }) => item.language === language);
        if(isLanguagePresent.length === 0){
            return res.status(400).json({
                message : `Code For Language '${language}' Not Found In Test Case`,
                success : false
            });
        }

        const TestFirstCodeFormat = isLanguagePresent[0];
        console.log('TestFirstCodeFormat:', `${code}${TestFirstCodeFormat.code}`);
        console.log( typeof `${code}${TestFirstCodeFormat.code}`);
        let Syntexoutput = '';
        let Syntexerror = '';
        let SyntexexecutionTime = 0;
        switch(TestFirstCodeFormat.language){
            case 'python': 
                ({ output: Syntexoutput, error: Syntexerror, executionTime: SyntexexecutionTime } = await runPython(sandbox, `${code}\n${TestFirstCodeFormat.code}`));
                break;
            case 'javascript':
                ({ output: Syntexoutput, error: Syntexerror, executionTime: SyntexexecutionTime } = await runJavaScript(sandbox, `${code}\n${TestFirstCodeFormat.code}`));
                break;
            case 'typescript':
                ({ output: Syntexoutput, error: Syntexerror, executionTime: SyntexexecutionTime } = await runTypeScript(sandbox, `${code}\n${TestFirstCodeFormat.code}`));
                break;
            case 'java':  
                ({ output: Syntexoutput, error: Syntexerror, executionTime: SyntexexecutionTime } = await runJava(sandbox, `${TestFirstCodeFormat.code}${code}`));
                break;
            case 'cpp': 
                ({ output: Syntexoutput, error: Syntexerror, executionTime: SyntexexecutionTime } = await runCpp(sandbox, `${TestFirstCodeFormat.code}${code}`));
                break;
            case 'c':
                ({ output: Syntexoutput, error: Syntexerror, executionTime: SyntexexecutionTime } = await runC(sandbox, `${TestFirstCodeFormat.code}${code}`));
                break;
            case 'go':
                ({ output: Syntexoutput, error: Syntexerror, executionTime: SyntexexecutionTime } = await runGo(sandbox, `${TestFirstCodeFormat.code}${code}`));
                break;
            case 'rust':
                ({ output: Syntexoutput, error: Syntexerror, executionTime: SyntexexecutionTime } = await runRust(sandbox, `${TestFirstCodeFormat.code}${code}`));
                break;
        }

        console.log('Syntexoutput:', Syntexoutput);
        console.log('Syntexerror:', Syntexerror);
        if(Syntexerror){
            return res.status(400).json({
                message : "Syntax Error In Code",
                error : Syntexerror,
                success : false
            });
        }

        console.log('FirstTestCaseExprectation:', FirstTestCaseExprectation);
        console.log('Syntexoutput.trim():', Syntexoutput);

        console.log('Type of FirstTestCaseExprectation:', typeof(FirstTestCaseExprectation));
        console.log('Type Of Syntexoutput.trim():', typeof(Syntexoutput));

        if(FirstTestCaseExprectation !== Syntexoutput.trim()){
            return res.status(400).json({
                message : "Code Did Not Pass The First Test Case. Please Check Your Code.",
                success : false
            });
        }

        /**@RUN ALL TEST CASES
         * This section runs the user's code against all provided test cases for the problem.
         * It ensures that the code meets all requirements and produces the expected outputs.
         * Thus It Make sure the code is correct and robust.
         */


        for(let testCase = 0; testCase < getTestCase.testcase.length; testCase++){
            console.log(`Running Test Case ${testCase + 1}`);

            const test = getTestCase.testcase[testCase]?.testcasecode;
            const TestCaseExprectation = getTestCase.testcase[testCase]?.expectedOutput;
            const ActualCodeFormat = JSON.parse(test || "[]");
            ActualCodeFormat.forEach( async (codeFormat: { language: string; code: string })=>{
                let output = '';
                let error = '';
                let executionTime = 0;
                if(codeFormat.language === language){
                    switch(language){
                        case 'python':
                            ({ output, error, executionTime } = await runPython(sandbox, `${code}\n${codeFormat.code}`, getTestCase.testcase[testCase]?.input));
                            break;

                        case 'javascript':
                            ({ output, error, executionTime } = await runJavaScript(sandbox, codeFormat.code, getTestCase.testcase[testCase]?.input));
                            break;

                        case 'typescript':
                            ({ output, error, executionTime } = await runTypeScript(sandbox, codeFormat.code, getTestCase.testcase[testCase]?.input));
                            break;

                        case 'java':
                            ({ output, error, executionTime } = await runJava(sandbox, codeFormat.code, getTestCase.testcase[testCase]?.input));
                            break;

                        case 'cpp': 
                            ({ output, error, executionTime } = await runCpp(sandbox, codeFormat.code, getTestCase.testcase[testCase]?.input));
                            break;

                        case 'c':
                            ({ output, error, executionTime } = await runC(sandbox, codeFormat.code, getTestCase.testcase[testCase]?.input));
                            break;

                        case 'go':
                            ({ output, error, executionTime } = await runGo(sandbox, codeFormat.code, getTestCase.testcase[testCase]?.input));
                            break;  
                        
                        case 'rust':
                            ({ output, error, executionTime } = await runRust(sandbox, codeFormat.code, getTestCase.testcase[testCase]?.input));
                            break;
                    }
                }
                if(error){
                    return res.status(400).json({
                        message : `Error In Test Case ${testCase + 1}`,
                        error : error,
                        success : false
                    });
                }

                if(output.trim() !== TestCaseExprectation){
                    return res.status(400).json({
                        message : `Test Case ${testCase + 1} Failed`,
                        expectedOutput : TestCaseExprectation,
                        yourOutput : output.trim(),
                        success : false
                    });
                }
            });           
        }
        return res.status(200).json({
            message : "Code Execution Completed Successfully",
            description : "All Test Cases Executed",
            success : true,
        })
    
    }catch(e){
        console.log(e);
        return res.status(500).json({
            message : "Internal Server Error",
            success : false
        })
    }
})

async function runPython(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
    try {
        await sandbox.files.write('/tmp/main.py', code);
        const execution = await sandbox.commands.run(
            input ? `echo "${input}" | python3 /tmp/main.py` : 'python3 /tmp/main.py'
        );
        return {
            output: execution.stdout,
            error: execution.stderr,
            executionTime: Date.now() - startTime
        };
    } catch (error: any) {
        return {
            output: error.result?.stdout || '',
            error: error.result?.stderr || error.message || 'Execution failed',
            executionTime: Date.now() - startTime
        };
    }
}

async function runJavaScript(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
    try {
        await sandbox.files.write('/tmp/main.js', code);
        const execution = await sandbox.commands.run(
            input ? `echo "${input}" | node /tmp/main.js` : 'node /tmp/main.js'
        );
        console.log('JavaScript execution result:', execution);
        return {
            output: execution.stdout,
            error: execution.stderr,
            executionTime: Date.now() - startTime
        };
    } catch (error: any) {
        return {
            output: error.result?.stdout || '',
            error: error.result?.stderr || error.message || 'Execution failed',
            executionTime: Date.now() - startTime
        };
    }
}

async function runTypeScript(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
    try {
        await sandbox.files.write('/tmp/main.ts', code);
        await sandbox.commands.run('npm install -g typescript ts-node 2>/dev/null || true');
        const execution = await sandbox.commands.run(
            input ? `echo "${input}" | ts-node /tmp/main.ts` : 'ts-node /tmp/main.ts'
        );
        return {
            output: execution.stdout,
            error: execution.stderr,
            executionTime: Date.now() - startTime
        };
    } catch (error: any) {
        return {
            output: error.result?.stdout || '',
            error: error.result?.stderr || error.message || 'Execution failed',
            executionTime: Date.now() - startTime
        };
    }
}

async function runJava(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
    try {
        const classNameMatch = code.match(/public\s+class\s+(\w+)/);
        const className = classNameMatch ? classNameMatch[1] : 'Main';
        await sandbox.files.write(`/tmp/${className}.java`, code);
        
        try {
            const compile = await sandbox.commands.run(`javac /tmp/${className}.java`);
            if (compile.stderr && compile.exitCode !== 0) {
                return {
                    output: '',
                    error: compile.stderr,
                    executionTime: Date.now() - startTime
                };
            }
        } catch (compileError: any) {
            return {
                output: '',
                error: compileError.result?.stderr || compileError.message || 'Compilation failed',
                executionTime: Date.now() - startTime
            };
        }
        
        try {
            const execution = await sandbox.commands.run(
                input 
                    ? `cd /tmp && echo "${input}" | java ${className}`
                    : `cd /tmp && java ${className}`
            );
            return {
                output: execution.stdout,
                error: execution.stderr,
                executionTime: Date.now() - startTime
            };
        } catch (execError: any) {
            return {
                output: execError.result?.stdout || '',
                error: execError.result?.stderr || execError.message || 'Execution failed',
                executionTime: Date.now() - startTime
            };
        }
    } catch (error: any) {
        return {
            output: '',
            error: error.message || 'Java execution failed',
            executionTime: Date.now() - startTime
        };
    }
}

async function runCpp(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
    try {
        await sandbox.files.write('/tmp/main.cpp', code);
        
        try {
            const compile = await sandbox.commands.run('g++ /tmp/main.cpp -o /tmp/main');
            if (compile.stderr && compile.exitCode !== 0) {
                return {
                    output: '',
                    error: compile.stderr,
                    executionTime: Date.now() - startTime
                };
            }
        } catch (compileError: any) {
            console.log('C++ compilation error:', compileError);
            return {
                output: '',
                error: compileError.result?.stderr || compileError.message || 'Compilation failed',
                executionTime: Date.now() - startTime
            };
        }
        
        try {
            const execution = await sandbox.commands.run(
                input ? `echo "${input}" | /tmp/main` : '/tmp/main'
            );
            console.log('C++ execution result:', execution);
            return {
                output: execution.stdout,
                error: execution.stderr,
                executionTime: Date.now() - startTime
            };
        } catch (execError: any) {
            return {
                output: execError.result?.stdout || '',
                error: execError.result?.stderr || execError.message || 'Execution failed',
                executionTime: Date.now() - startTime
            };
        }
    } catch (error: any) {
        return {
            output: '',
            error: error.message || 'C++ execution failed',
            executionTime: Date.now() - startTime
        };
    }
}

async function runC(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
    try {
        await sandbox.files.write('/tmp/main.c', code);
        
        try {
            const compile = await sandbox.commands.run('gcc /tmp/main.c -o /tmp/main');
            if (compile.stderr && compile.exitCode !== 0) {
                return {
                    output: '',
                    error: compile.stderr,
                    executionTime: Date.now() - startTime
                };
            }
        } catch (compileError: any) {
            return {
                output: '',
                error: compileError.result?.stderr || compileError.message || 'Compilation failed',
                executionTime: Date.now() - startTime
            };
        }
        
        try {
            const execution = await sandbox.commands.run(
                input ? `echo "${input}" | /tmp/main` : '/tmp/main'
            );
            return {
                output: execution.stdout,
                error: execution.stderr,
                executionTime: Date.now() - startTime
            };
        } catch (execError: any) {
            return {
                output: execError.result?.stdout || '',
                error: execError.result?.stderr || execError.message || 'Execution failed',
                executionTime: Date.now() - startTime
            };
        }
    } catch (error: any) {
        return {
            output: '',
            error: error.message || 'C execution failed',
            executionTime: Date.now() - startTime
        };
    }
}

async function runGo(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
    try {
        await sandbox.files.write('/tmp/main.go', code);
        const execution = await sandbox.commands.run(
            input 
                ? `cd /tmp && echo "${input}" | go run main.go`
                : 'cd /tmp && go run main.go'
        );
        return {
            output: execution.stdout,
            error: execution.stderr,
            executionTime: Date.now() - startTime
        };
    } catch (error: any) {
        return {
            output: error.result?.stdout || '',
            error: error.result?.stderr || error.message || 'Execution failed',
            executionTime: Date.now() - startTime
        };
    }
}

async function runRust(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
    try {
        await sandbox.files.write('/tmp/main.rs', code);
        
        try {
            const compile = await sandbox.commands.run('rustc /tmp/main.rs -o /tmp/main');
            if (compile.stderr && compile.exitCode !== 0) {
                return {
                    output: '',
                    error: compile.stderr,
                    executionTime: Date.now() - startTime
                };
            }
        } catch (compileError: any) {
            return {
                output: '',
                error: compileError.result?.stderr || compileError.message || 'Compilation failed',
                executionTime: Date.now() - startTime
            };
        }
        
        try {
            const execution = await sandbox.commands.run(
                input ? `echo "${input}" | /tmp/main` : '/tmp/main'
            );
            return {
                output: execution.stdout,
                error: execution.stderr,
                executionTime: Date.now() - startTime
            };
        } catch (execError: any) {
            return {
                output: execError.result?.stdout || '',
                error: execError.result?.stderr || execError.message || 'Execution failed',
                executionTime: Date.now() - startTime
            };
        }
    } catch (error: any) {
        return {
            output: '',
            error: error.message || 'Rust execution failed',
            executionTime: Date.now() - startTime
        };
    }
}



export default poblemsubmitRouter;