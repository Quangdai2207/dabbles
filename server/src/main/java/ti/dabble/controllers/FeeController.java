package ti.dabble.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;
import ti.dabble.entities.Fee;
import ti.dabble.requests.CreateFeeRequest;
import ti.dabble.requests.UpdateFeeRequest;
import ti.dabble.response_status.Status;
import ti.dabble.response_status.StatusObject;
import ti.dabble.services.fee.IFeeService;

@RestController
@RequestMapping("/api/fee")
class FeeController {
    @Autowired
    private IFeeService feeService;

    @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<Fee>> createFee(@Valid @RequestBody CreateFeeRequest request) {
        StatusObject<Fee> statusObject = feeService.createFee(request);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<Fee>> updateFee(@PathVariable("id") String id, @Valid @RequestBody UpdateFeeRequest request) {
        StatusObject<Fee> statusObject = feeService.updateFee(id, request);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @GetMapping(value = "/get-fee-by-id/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<Fee>> getFeeById(@PathVariable("id") String id) {
        StatusObject<Fee> statusObject = feeService.getFeeById(id);
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @GetMapping(value = "/get-all-fees", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusObject<List<Fee>>> getAllFees() {
        StatusObject<List<Fee>> statusObject = feeService.getAllFees();
        return ResponseEntity.status(statusObject.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(statusObject);
    }

    @DeleteMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Status> deleteFee(@PathVariable("id") String id) {
        Status status = feeService.deleteFee(id);
        return ResponseEntity.status(status.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(status);
    }
}
