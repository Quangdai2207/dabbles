package ti.dabble.configs;

import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.media.StringSchema;

import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.method.HandlerMethod;

public class SwaggerHeaderOperationCustomizer implements OperationCustomizer {

    @Override
    public Operation customize(Operation operation, HandlerMethod handlerMethod) {
        // Get the class-level RequestMapping to build the full path
        RequestMapping classRequestMapping = handlerMethod.getBeanType().getAnnotation(RequestMapping.class);
        String basePath = "";
        if (classRequestMapping != null && classRequestMapping.value().length > 0) {
            basePath = classRequestMapping.value()[0];
        }

        // Check for RequestMapping at method level
        RequestMapping methodRequestMapping = handlerMethod.getMethod().getAnnotation(RequestMapping.class);
        String path = "";

        // Also check for PostMapping and PutMapping specifically
        PostMapping postMapping = handlerMethod.getMethod().getAnnotation(PostMapping.class);
        PutMapping putMapping = handlerMethod.getMethod().getAnnotation(PutMapping.class);
        String postPath = "";
        String putPath = "";

        if (methodRequestMapping != null && methodRequestMapping.value().length > 0) {
            path = methodRequestMapping.value()[0];
        } else if (postMapping != null && postMapping.value().length > 0) {
            postPath = postMapping.value()[0];
        } else if (putMapping != null && putMapping.value().length > 0) {
            putPath = putMapping.value()[0];
        }

        // Build the full path by combining base path and method path
        String finalPath = "";
        if (!postPath.isEmpty()) {
            finalPath = basePath + postPath;
        } else if (!putPath.isEmpty()) {
            finalPath = basePath + putPath;
        } else if (!path.isEmpty()) {
            finalPath = basePath + path;
        } else {
            // If no method-level annotation, just use the base path
            finalPath = basePath;
        }

        if (finalPath == null || finalPath.isEmpty()) return operation;

        // POST /login
        if (finalPath.contains("auth/login")) {
            operation.addParametersItem(new Parameter()
                                                .name("X-Captcha-Token")
                                                .in("header")
                                                .description("Turnstile Captcha Token")
                                                .required(true)
                                                .schema(new StringSchema()._default("")));
        }

        if (finalPath.contains("/auth/register")) {
            operation.addParametersItem(new Parameter()
                                                .name("X-Register-Token")
                                                .in("header")
                                                .description("Turnstile Captcha Token")
                                                .required(true)
                                                .schema(new StringSchema()._default("")));
        }

        return operation;
    }
}

