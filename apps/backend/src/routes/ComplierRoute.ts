import { Router } from "express";
import { Sandbox } from '@e2b/code-interpreter';
import { ComilerRateLimiter } from "../limiter/RateLimiter.js";
import { UserAuthMiddleware } from "../middleware/user.js";
const compilerRouter = Router();

compilerRouter.post("/run", ComilerRateLimiter , UserAuthMiddleware , async (req, res) => {
    try {
        const { code, language, input } = req.body;
        
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

        try {
            let output = '';
            let error = '';
            let executionTime = 0;

            switch (language) {
                case 'python':
                    const pyResult = await runPython(sandbox, code, input);
                    output = pyResult.output;
                    error = pyResult.error;
                    executionTime = pyResult.executionTime;
                    break;

                case 'javascript':
                    const jsResult = await runJavaScript(sandbox, code, input);
                    console.log('JavaScript execution result:', jsResult);
                    output = jsResult.output;
                    error = jsResult.error;
                    executionTime = jsResult.executionTime;
                    break;

                case 'typescript':
                    const tsResult = await runTypeScript(sandbox, code, input);
                    output = tsResult.output;
                    error = tsResult.error;
                    executionTime = tsResult.executionTime;
                    break;

                case 'java':
                    const javaResult = await runJava(sandbox, code, input);
                    output = javaResult.output;
                    error = javaResult.error;
                    executionTime = javaResult.executionTime;
                    break;

                case 'cpp':
                    const cppResult = await runCpp(sandbox, code, input);
                    output = cppResult.output;
                    error = cppResult.error;
                    executionTime = cppResult.executionTime;
                    break;

                case 'c':
                    const cResult = await runC(sandbox, code, input);
                    output = cResult.output;
                    error = cResult.error;
                    executionTime = cResult.executionTime;
                    break;

                case 'go':
                    const goResult = await runGo(sandbox, code, input);
                    output = goResult.output;
                    error = goResult.error;
                    executionTime = goResult.executionTime;
                    break;

                case 'rust':
                    const rustResult = await runRust(sandbox, code, input);
                    output = rustResult.output;
                    error = rustResult.error;
                    executionTime = rustResult.executionTime;
                    break;
            }

            return res.status(200).json({
                success: true,
                output,
                error,
                executionTime,
                language
            });

        } finally {
            const closeFn = (sandbox as any).close?? (sandbox as any).destroy ??(sandbox as any).shutdown;
            if (typeof closeFn ==="function") {
                await closeFn.call(sandbox);
            }
        }

    } catch (e) {
        console.error('Execution error:', e);
        return res.status(500).json({
            message: "Code Execution Failed",
            success: false,
            error: e instanceof Error ? e.message : 'Unknown error'
        });
    }
});


async function runPython(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
    await sandbox.files.write('/tmp/main.py', code);
    const execution = await sandbox.commands.run(
        input ? `echo "${input}" | python3 /tmp/main.py` : 'python3 /tmp/main.py'
    );
    return {
        output: execution.stdout,
        error: execution.stderr,
        executionTime: Date.now() - startTime
    };
}

async function runJavaScript(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
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
}

async function runTypeScript(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
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
}

async function runJava(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
    const classNameMatch = code.match(/public\s+class\s+(\w+)/);
    const className = classNameMatch ? classNameMatch[1] : 'Main';
    await sandbox.files.write(`/tmp/${className}.java`, code);
    const compile = await sandbox.commands.run(`javac /tmp/${className}.java`);
    if (compile.stderr) {
        return {
            output: '',
            error: compile.stderr,
            executionTime: Date.now() - startTime
        };
    }
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
}

async function runCpp(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
    await sandbox.files.write('/tmp/main.cpp', code);
    const compile = await sandbox.commands.run('g++ /tmp/main.cpp -o /tmp/main');
    if (compile.stderr && compile.exitCode !== 0) {
        return {
            output: '',
            error: compile.stderr,
            executionTime: Date.now() - startTime
        };
    }
    const execution = await sandbox.commands.run(
        input ? `echo "${input}" | /tmp/main` : '/tmp/main'
    );
    return {
        output: execution.stdout,
        error: execution.stderr,
        executionTime: Date.now() - startTime
    };
}

async function runC(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
    
    await sandbox.files.write('/tmp/main.c', code);
    const compile = await sandbox.commands.run('gcc /tmp/main.c -o /tmp/main');
    if (compile.stderr && compile.exitCode !== 0) {
        return {
            output: '',
            error: compile.stderr,
            executionTime: Date.now() - startTime
        };
    }
    const execution = await sandbox.commands.run(
        input ? `echo "${input}" | /tmp/main` : '/tmp/main'
    );
    return {
        output: execution.stdout,
        error: execution.stderr,
        executionTime: Date.now() - startTime
    };
}

async function runGo(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
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
}

async function runRust(sandbox: any, code: string, input?: string) {
    const startTime = Date.now();
    await sandbox.files.write('/tmp/main.rs', code);
    const compile = await sandbox.commands.run('rustc /tmp/main.rs -o /tmp/main');
    if (compile.stderr && compile.exitCode !== 0) {
        return {
            output: '',
            error: compile.stderr,
            executionTime: Date.now() - startTime
        };
    }
    const execution = await sandbox.commands.run(
        input ? `echo "${input}" | /tmp/main` : '/tmp/main'
    );
    
    return {
        output: execution.stdout,
        error: execution.stderr,
        executionTime: Date.now() - startTime
    };
}

export default compilerRouter;