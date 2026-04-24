import 'package:equatable/equatable.dart';

import '../../../category/domain/entities/category_entity.dart';
import '../../../user/domain/entities/user_basic_entity.dart';

class ImageUrlsEntity extends Equatable {
  const ImageUrlsEntity({
    required this.w236,
    required this.w474,
    required this.w736,
    required this.w1080,
    required this.original,
  });

  final String w236;
  final String w474;
  final String w736;
  final String w1080;
  final String original;

  @override
  List<Object?> get props => <Object?>[w236, w474, w736, w1080, original];
}

class ImageEntity extends Equatable {
  const ImageEntity({
    required this.id,
    required this.creator,
    required this.imageUrls,
    required this.likeCount,
    required this.commentCount,
    required this.createdDate,
    required this.price,
    required this.liked,
    this.width,
    this.height,
    this.categories,
    this.description,
    this.purchased,
    this.visible,
  });

  final String id;
  final UserBasicEntity creator; // Using UserBasicEntity from Auth feature
  final ImageUrlsEntity imageUrls;
  final int likeCount;
  final int commentCount;
  final DateTime createdDate;
  final double price;
  final bool liked;

  // Optional / Details fields
  final int? width;
  final int? height;
  final List<CategoryEntity>? categories;
  final String? description;
  final bool? purchased;
  final bool? visible;

  @override
  List<Object?> get props => <Object?>[
    id,
    creator,
    imageUrls,
    likeCount,
    commentCount,
    createdDate,
    price,
    liked,
    width,
    height,
    categories,
    description,
    purchased,
    visible,
  ];
}
