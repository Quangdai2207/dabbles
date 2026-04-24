import 'package:equatable/equatable.dart';

class CategoryEntity extends Equatable {
  const CategoryEntity({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    required this.featured,
    this.createdDate,
    this.updatedDate,
    this.deleted = false,
  });

  final String id;
  final String name;
  final String slug;
  final String? description;
  final bool featured;
  final DateTime? createdDate;
  final DateTime? updatedDate;
  final bool deleted;

  @override
  List<Object?> get props => <Object?>[
    id,
    name,
    slug,
    description,
    featured,
    createdDate,
    updatedDate,
    deleted,
  ];
}
