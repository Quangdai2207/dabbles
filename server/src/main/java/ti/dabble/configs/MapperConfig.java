package ti.dabble.configs;

import ti.dabble.dtos.*;
import ti.dabble.entities.*;

import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT);

        // ✅ Converter UUID -> String
        modelMapper.addConverter(ctx -> ctx.getSource() == null ? null : ctx.getSource().toString(),
                UUID.class,
                String.class);

        modelMapper.addMappings(new PropertyMap<User, ProfileUserDto>() {
            @Override
            protected void configure() {
                using(ctx -> ctx.getSource().toString())
                .map(source.getId(), destination.getId());
                map().setUsername(source.getUsername());
                map().setFirstName(source.getFirstname());
                map().setLastName(source.getLastname());
                map().setEmail(source.getEmail());
                map().setPhone(source.getPhone());
                map().setPublic(source.isPublic());
                map().setAvatar(source.getAvatar());
                map().setDob(source.getDateOfBirth());
            }
        });

        modelMapper.addMappings(new PropertyMap<Conversation, ConversationResponseDto>() {
            @Override
            protected void configure() {
                using(ctx -> ctx.getSource().toString())
                .map(source.getId(), destination.getConversationId());
                map().setName(source.getName());
                map().setType(source.getType());
            }
        });

        return modelMapper;
    }

}
