package webdev2.eventmanagement.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import webdev2.eventmanagement.model.InvitationCode;

public interface InvitationsCodeRepository extends MongoRepository<InvitationCode,String> {
}
