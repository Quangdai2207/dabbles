package ti.dabble.services.fee;

import java.util.List;

import ti.dabble.entities.Fee;
import ti.dabble.requests.CreateFeeRequest;
import ti.dabble.requests.UpdateFeeRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;

public interface IFeeService {
    StatusObject<Fee> createFee(CreateFeeRequest request);
    StatusObject<Fee> updateFee(String id, UpdateFeeRequest request);
    StatusObject<Fee> getFeeById(String id);
    StatusObject<List<Fee>> getAllFees();
    Status deleteFee(String id);
}
