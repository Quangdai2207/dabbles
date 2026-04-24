package ti.dabble.configs;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                              .title("APIs Of Ecommerce Project")
                              .description("Spring Boot REST API Documentation")
                              .version("1.0.0"))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                // Định nghĩa scheme
                .components(new io.swagger.v3.oas.models.Components()

                                    .addSecuritySchemes(
                                            securitySchemeName,
                                            new SecurityScheme()
                                                    .name(securitySchemeName)
                                                    .type(SecurityScheme.Type.HTTP)
                                                    .scheme("bearer")
                                                    .bearerFormat("JWT")
                                    )
                );
    }

    @Bean
    public OperationCustomizer swaggerHeaderOperationCustomizer() {
        return new SwaggerHeaderOperationCustomizer();
    }
}
