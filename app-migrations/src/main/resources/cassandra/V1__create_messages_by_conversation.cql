CREATE TABLE IF NOT EXISTS messages (
                                        id text,
                                        conversation_id text,
                                        sender_id text,
                                        content text,
                                        message_type text,
                                        created_date timestamp,
                                        updated_date timestamp,
                                        is_deleted boolean,
    -- Khóa chính phức hợp:
    -- conversation_id: Partition Key (Gom dữ liệu)
    -- created_date: Clustering Key (Sắp xếp giảm dần)
    -- id: Clustering Key (Đảm bảo tính duy nhất nếu trùng giờ)
                                        PRIMARY KEY ((conversation_id), created_date, id)
) WITH CLUSTERING ORDER BY (created_date DESC, id ASC);