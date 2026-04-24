import 'package:json_annotation/json_annotation.dart';

import '../../../category/data/models/category_model.dart';
import '../../../user/data/models/user_basic_model.dart';
import '../../domain/entities/image_entity.dart';

part 'image_model.g.dart';

@JsonSerializable()
class ImageUrlsModel extends ImageUrlsEntity {
  const ImageUrlsModel({
    required super.w236,
    required super.w474,
    required super.w736,
    required super.w1080,
    required super.original,
  });

  factory ImageUrlsModel.fromJson(Map<String, dynamic> json) =>
      _$ImageUrlsModelFromJson(json);

  Map<String, dynamic> toJson() => _$ImageUrlsModelToJson(this);
}

@JsonSerializable()
class ImageModel extends ImageEntity {
  const ImageModel({
    required super.id,
    required this.creatorModel,
    required this.imageUrlsModel,
    required super.likeCount,
    required super.commentCount,
    required super.createdDate,
    required super.price,
    required super.liked,
    super.width,
    super.height,
    this.categoryModels,
    super.description,
    super.purchased,
    super.visible,
  }) : super(
         creator: creatorModel,
         imageUrls: imageUrlsModel,
         categories: categoryModels,
       );

  factory ImageModel.fromJson(Map<String, dynamic> json) =>
      _$ImageModelFromJson(json);

  @JsonKey(name: 'creator')
  final UserBasicModel creatorModel;

  @JsonKey(name: 'imageUrls')
  final ImageUrlsModel imageUrlsModel;

  @JsonKey(name: 'categories')
  final List<CategoryModel>? categoryModels;

  Map<String, dynamic> toJson() => _$ImageModelToJson(this);
}
