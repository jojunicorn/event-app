package webdev2.eventmanagement.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import webdev2.eventmanagement.model.InvitationCode;

import java.util.Optional;

public interface InvitationCodeRepository extends MongoRepository<InvitationCode,String> {
    Optional<InvitationCode> findByUserIdAndCode(String userId, String code);
    Optional<InvitationCode> findByCode(String code);
}
