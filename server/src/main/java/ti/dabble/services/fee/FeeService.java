package ti.dabble.services.fee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import ti.dabble.entities.Fee;
import ti.dabble.repositories.FeeRepository;
import ti.dabble.requests.CreateFeeRequest;
import ti.dabble.requests.UpdateFeeRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
@Service
public class FeeService implements IFeeService {
    @Autowired
    private FeeRepository feeRepository;

    @Override
    public StatusObject<Fee> createFee(CreateFeeRequest request) {
        StatusObject<Fee> statusObject = new StatusObject<>(false, "", "", null);
        try {
            Fee existFee = feeRepository.findFeeByType(request.getType());
            if(existFee != null) {
                statusObject.setErrorMessage("Fee of this type is already exist");
                return statusObject;
            }
            Fee newFee = new Fee();
            newFee.setPercent(request.getPercent());
            newFee.setType(request.getType());
            feeRepository.save(newFee);
            statusObject.setSuccess(true);
            statusObject.setMessage("Create fee successfully");
            statusObject.setData(newFee);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<Fee> updateFee(
            String id,
            UpdateFeeRequest request
    ) {
        StatusObject<Fee> statusObject = new StatusObject<>(false, "", "", null);
        try {
            Fee existFee = feeRepository.findById(UUID.fromString(id)).orElse(null);
            if(existFee == null) {
                statusObject.setErrorMessage("This fee does not exist");
                return statusObject;
            }

            existFee.setPercent(request.getPercent());
            feeRepository.save(existFee);
            statusObject.setSuccess(true);
            statusObject.setErrorMessage("Update fee successfully");
            statusObject.setData(existFee);
            return statusObject;
        } catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<Fee> getFeeById(String id) {
        StatusObject<Fee> statusObject = new StatusObject<>(false, "", "", null);
        try {
            Fee fee = feeRepository.findFeeById(UUID.fromString(id));
            if(fee == null) {
                statusObject.setErrorMessage("This fee does not exist");
                return statusObject;
            }
            statusObject.setSuccess(true);
            statusObject.setErrorMessage("Get fee successfully");
            statusObject.setData(fee);
            return statusObject;

        }
        catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public StatusObject<List<Fee>> getAllFees() {
        StatusObject<List<Fee>> statusObject = new StatusObject<>(false, "", "", null);
        try {
            List<Fee> fees = feeRepository.findAllFees();
            if(fees.isEmpty()) {
                statusObject.setSuccess(true);
                statusObject.setMessage("No fee found");
                return statusObject;
            }
            statusObject.setSuccess(true);
            statusObject.setErrorMessage("Get fee successfully");
            statusObject.setData(fees);
            return statusObject;

        }
        catch (Exception e) {
            statusObject.setErrorMessage(e.getMessage());
            return statusObject;
        }
    }

    @Override
    public Status deleteFee(String id) {
        Status status = new Status(false, "", "");
        try {
            Fee existFee = feeRepository.findById(UUID.fromString(id)).orElse(null);
            if(existFee == null) {
                status.setErrorMessage("This fee does not exist");
                return status;
            }
            existFee.setIsDeleted(true);
            feeRepository.save(existFee);

            status.setIsSuccess(true);
            status.setMessage("Delete fee successfully");
            return status;
        } catch (Exception e) {
            status.setErrorMessage(e.getMessage());
            return status;
        }
    }
}
