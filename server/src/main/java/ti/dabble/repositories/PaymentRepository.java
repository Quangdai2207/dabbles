package ti.dabble.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import ti.dabble.entities.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findAllByStatusAndCreatedDateBefore(int status, LocalDateTime dateTime);

    List<Payment> findAllByUserId(UUID userId);

    Payment findPaymentByReferenceId(String referenceId);

    @Query("SELECT COUNT(p) FROM Payment p ")
    long countPayments();
}
