package ti.dabble.services.proxy;

import ti.dabble.models.principal.UserPrincipal;

public interface IAuthProxyService {
    UserPrincipal verify(String token);
}

