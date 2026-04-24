package ti.dabble.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

import ti.dabble.entities.Fee;
import ti.dabble.enums.TransactionType;

@Repository
public interface FeeRepository extends JpaRepository<Fee, UUID> {
    @Query("SELECT f FROM Fee f WHERE f.type = :type AND f.isDeleted = false")
    Fee findFeeByType(@Param("type") TransactionType type);

    @Query("SELECT f FROM Fee f WHERE f.isDeleted = false")
    List<Fee> findAllFees();

    @Query("SELECT f FROM Fee f WHERE f.isDeleted = false AND f.id = :id")
    Fee findFeeById(@Param("id") UUID id);
}
