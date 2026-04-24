package ti.dabble.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SPAConfiguration implements WebMvcConfigurer {

    /**
     * <div style="padding: 20px; border: 2px solid #eeee; color: white; font-family: 'roboto'">
     *     <h4 style="margin-bottom: 20px; text-decoration: underline">Configuration SPA based on Spring MVC</h4>
     *     <p>
     *         Registry View Controller to forward page <strong style="color: green" >index.html</strong> within static resource
     *         <ul style="padding-left: 10px">
     *             <li>
     *                 <strong>Path:</strong> <span>/resource/static/index.html</span>
     *             </li>
     *         </ul>
     *     </p>
     *     <hr />
     *     <p>
     *         Instead defines View Controller inside the controller package, we can define it by
     *         annotation <strong style="font-style: italic; color: #FF95A2">{@Configuration}</strong>
     *         Spring in this case. including:
     *         <ul>
     *             <li>
     *                 <strong style="color: #FF95A2">{@Override}</strong> method <strong style="color: #EEEE">addViewController</strong>
     *                 with parameter <i style="color: #EEEE">registry</i>
     *             </li>
     *             <li>
     *                 <strong style="color:#EEEE">Registry</strong> parameter has type <strong style="color: #EEEE">ViewControllerRegistry</strong>,
     *                 Using this param we can registry view Controller directly without define {@Controller} in the
     *                 controller package.
     *             </li>
     *         </ul>
     *     </p>
     * </div>
     *
     **/
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry
                .addViewController("/{path:[^\\.]*}")
                .setViewName("forward:/index.html");
        registry
                .addViewController("/**/{path:[^\\.]*}")
                .setViewName("forward:/index.html");
    }
}
